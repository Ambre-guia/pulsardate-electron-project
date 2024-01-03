// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process unless
// nodeIntegration is set to true in webPreferences.
// Use preload.js to selectively enable features
// needed in the renderer process.
import { showCreateEvent, showCalendar, showEvent } from "./utils/utils.js";

// Import the function closeWindow from the preload script
const closeWindow = window.electron.closeWindow;
const reloadWindow = window.electron.reloadWindow;


// Declare the refresh function outside the if block
const refreshCalendar = async (container: HTMLElement, month: number, year: number) => {
  await showCalendar(container, month, year);
};

(async () => {
  try {
    // Assuming you have a DOM element with the id 'calendarContainer' to display the calendar
    const calendarContainer = document.getElementById("tableCalendar");
    const eventContainer = document.getElementById("eventContainer");
    const eventUpdateContainer = document.getElementById("eventUpdateContainer");

    // Get the current month and year outside the if block
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    if (calendarContainer) {
      // Call the showCalendar function with the current month and year and pass the refresh function
      await showCalendar(calendarContainer, currentMonth, currentYear, refreshCalendar);
    }

    if (eventContainer) {
      // Pass the refresh function to showCreateEvent
      await showCreateEvent(eventContainer, currentMonth, currentYear, () => refreshCalendar(calendarContainer, currentMonth, currentYear), closeWindow, reloadWindow);
    }

    if(eventUpdateContainer){
      window.electron.onUpdateEvent((e:any, event:any) => {
      showEvent(event)
});
    }
  } catch (err) {
    console.error(err);
  }
})();
