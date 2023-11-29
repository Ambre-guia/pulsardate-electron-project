// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
import { showCalendar } from "./utils/utils.js";
(async () => {
    try {
        // Example of fetching events
        const events = await window.electron.getEvents();
        console.log(events);
        // Assuming you have a DOM element with the id 'calendarContainer' to display the calendar
        const calendarContainer = document.getElementById("tableCalendar");
        if (calendarContainer) {
            // Call the showCalendar function to display the calendar
            showCalendar(calendarContainer);
        }
    }
    catch (err) {
        console.error(err);
    }
})();
