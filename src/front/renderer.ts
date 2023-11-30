// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.

import { /* showEvents, */ showCalendar } from "./utils/utils.js";

(async () => {
  try {
    // Assuming you have a DOM element with the id 'calendarContainer' to display the calendar
    const calendarContainer = document.getElementById("tableCalendar");

    if (calendarContainer) {
      // Example of fetching events
      const events = await window.electron.getEvents();
      console.log(events);

      // Get the current month and year
      const currentDate = new Date();
      const currentMonth = currentDate.getMonth();
      const currentYear = currentDate.getFullYear();

      // Call the showCalendar function with the current month and year
      await showCalendar(calendarContainer, currentMonth, currentYear);
    }
  } catch (err) {
    console.error(err);
  }
})();
