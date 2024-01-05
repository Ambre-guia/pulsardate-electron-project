export async function showCalendar(
    container: HTMLElement,
    targetMonth: number,
    targetYear: number,
    refreshCalendarCallback?: (container: HTMLElement, month: number, year: number) => Promise<void>
): Promise<void> {
    try {
        // Remove existing content from the container
        container.innerHTML = "";

        // Create the header element
        const calendarHeader = document.createElement("header");
        calendarHeader.classList.add("dflex");

        // Previous button
        const previousButton = document.createElement("button");
        previousButton.textContent = "";
        previousButton.classList.add("left");
        previousButton.addEventListener("click", async () => {
            const newDate = new Date(targetYear, targetMonth - 1, 1);
            await showCalendar(container, newDate.getMonth(), newDate.getFullYear());
        });

        // Month title
        const monthTitle = document.createElement("h1");
        monthTitle.classList.add("title");
        monthTitle.textContent = `${getMonthName(targetMonth)} ${targetYear}`;

        // Next button
        const nextButton = document.createElement("button");
        nextButton.textContent = "";
        nextButton.classList.add("right");
        nextButton.addEventListener("click", async () => {
            const newDate = new Date(targetYear, targetMonth + 1, 1);
            await showCalendar(container, newDate.getMonth(), newDate.getFullYear());
        });

        // Add elements to the header
        calendarHeader.appendChild(previousButton);
        calendarHeader.appendChild(monthTitle);
        calendarHeader.appendChild(nextButton);

        // Add the header to the container
        container.appendChild(calendarHeader);

        // Get all events
        const events = await window.electron.getAll();

        // Create a table for the calendar
        const calendarTable = document.createElement("table");

        // Create the header row with day names
        const headerRow = document.createElement("tr");
        ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
            const headerCell = document.createElement("th");
            headerCell.textContent = day;
            headerRow.appendChild(headerCell);
        });
        calendarTable.appendChild(headerRow);

        // Calculate the number of days in the month
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();

        // Calculate the day of the week for the first day of the month
        const startDayOfWeek = new Date(targetYear, targetMonth, 1).getDay();

        // Get the current day
        const currentDate = new Date();

        const actualDay = currentDate;
        const actualMonth = currentDate.getMonth();
        const actualYear = currentDate.getFullYear();
        let dayIndex = 1;
        for (let i = 0; i < 6; i++) {
            const calendarRow = document.createElement("tr");
            let rowIsEmpty = true; // Variable to track if the row is empty

            for (let j = 0; j < 7; j++) {
                const calendarCell = document.createElement("td");
                const eventCell = document.createElement("div");

                calendarCell.classList.add("day");
                eventCell.classList.add("event");

                // Get the date of the current day in the loop
                const currentDate = new Date(targetYear, targetMonth, dayIndex);

                // Display events for this date
                const eventsForDay = events.filter((event) => {
                    const eventStartDate = new Date(event.date_deb);
                    const eventEndDate = new Date(event.date_fin);

                    // Get the date without considering the hour, minutes, etc.
                    const currentDateWithoutTime = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        currentDate.getDate()
                    );
                    const eventStartDateWithoutTime = new Date(
                        eventStartDate.getFullYear(),
                        eventStartDate.getMonth(),
                        eventStartDate.getDate()
                    );
                    const eventEndDateWithoutTime = new Date(
                        eventEndDate.getFullYear(),
                        eventEndDate.getMonth(),
                        eventEndDate.getDate()
                    );

                    // Check if the current date is between the start date (inclusive) and the end date of the event
                    return (
                        currentDateWithoutTime.getTime() >=
                        eventStartDateWithoutTime.getTime() &&
                        currentDateWithoutTime.getTime() <= eventEndDateWithoutTime.getTime()
                    );
                });

                // Fill the cell with the day if it's in the month
                if (i === 0 && j < startDayOfWeek) {
                    // Add empty cells for days before the start of the month
                    calendarCell.textContent = "";
                } else if (dayIndex <= daysInMonth) {
                    // Add days of the month
                    calendarCell.textContent = `${dayIndex}`;

                    // Add the "actualDay" class if it's the current day
                    if (
                        currentDate.getFullYear() === actualYear &&
                        currentDate.getMonth() === actualMonth &&
                        dayIndex === actualDay.getDate()
                    ) {
                        calendarCell.classList.add("actualDay");
                    }

                    // Add the event cell only if there are events for this day
                    if (eventsForDay.length > 0) {
                        eventsForDay.forEach((event) => {
                            const eventElement = document.createElement("div");
                            eventElement.textContent = event.titre;

                            // Add the click event listener to each eventElement
                            eventElement.addEventListener("click", async () => {
                                // Open the update window here
                                // window.electron.createUpdateWindow();
                                showUpdateEvent(event.id);
                            });

                            eventCell.appendChild(eventElement);
                        });
                    }

                    dayIndex++;
                    rowIsEmpty = false; // The row is not empty
                }

                calendarCell.appendChild(eventCell);
                calendarRow.appendChild(calendarCell);
            }

            // Check if the row is not empty before adding it
            if (!rowIsEmpty) {
                calendarTable.appendChild(calendarRow);
            }
        }

        // Add the calendar table to the container
        container.appendChild(calendarTable);

        // Call the refresh function if provided
        if (refreshCalendarCallback) {
            refreshCalendarCallback(container, targetMonth, targetYear);
        }
    } catch (error) {
        console.error("Error retrieving calendar data:", error);
        alert("An error occurred while retrieving calendar data. Please try again.");
    }
}

export function showUpdateEvent(eventId: number) {
    try {
        window.electron.createUpdateWindowEvent(eventId);
    } catch (err) {
        console.error(err);
        alert("An error occurred while showing the update event window. Please try again.");
    }
}

function getMonthName(monthNumber: number): string {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    return months[monthNumber];
}
