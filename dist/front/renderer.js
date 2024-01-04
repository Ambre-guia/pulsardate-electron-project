import { showCreateEvent } from "./utils/event/createEvent.js";
import { showImport } from "./utils/import/showImport.js";
import { showCalendar } from "./utils/calendar/showCalendar.js";
import { showEvent } from "./utils/event/showEvent.js";
// Declare the refresh function outside the if block
const refreshCalendar = async (container, month, year) => {
    await showCalendar(container, month, year);
};
(async () => {
    try {
        // Assuming you have a DOM element with the id 'calendarContainer' to display the calendar
        const calendarContainer = document.getElementById("tableCalendar");
        const eventContainer = document.getElementById("eventContainer");
        const eventUpdateContainer = document.getElementById("eventUpdateContainer");
        const importContainer = document.getElementById("importContainer");
        // Get the current month and year outside the if block
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        // container in index.html
        if (calendarContainer) {
            await showCalendar(calendarContainer, currentMonth, currentYear, refreshCalendar);
        }
        // container in event.html
        if (eventContainer) {
            showCreateEvent(eventContainer, currentMonth, currentYear);
        }
        // container in update-event.html
        if (eventUpdateContainer) {
            window.electron.onUpdateEvent((e, event) => {
                showEvent(event);
            });
        }
        // container in import.html
        if (importContainer) {
            window.electron.onUpdateImport((e, event) => {
                showImport(event);
            });
        }
    }
    catch (err) {
        console.error(err);
    }
})();
