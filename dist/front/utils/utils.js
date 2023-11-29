/* export function showCalendar(events: IEvent[], container: HTMLElement): void {
  // Clear the existing content in the container
  container.innerHTML = "";

  const currentMonth = await window.electron.getCurrentMonth()
  // Create and append calendar elements based on the events
  events.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.innerHTML = `
        <h3>${event.title}</h3>
        <p>Date: ${event.date}</p>
        <p>Location: ${event.location}</p>
        <p>Description: ${event.description}</p>
        <hr>
      `;
    container.appendChild(eventElement);
  });
} */
export async function showCalendar(container) {
    // Clear the existing content in the container
    container.innerHTML = "";
    try {
        const currentMonth = await window.electron.getCurrentMonth();
        // Display the current month in a simple way
        const monthElement = document.createElement("h2");
        monthElement.textContent = `Month: ${currentMonth}`;
        container.appendChild(monthElement);
    }
    catch (error) {
        console.error("Error fetching calendar data:", error);
    }
}
export function showEvents(event, elem) {
    elem.innerHTML = "";
    event.forEach((event) => {
        const ligne = document.createElement("tr");
        const utils = document.createElement("td");
        const supp = document.createElement("button");
        const modif = document.createElement("button");
    });
}
