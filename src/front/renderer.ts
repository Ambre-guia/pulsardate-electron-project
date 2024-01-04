import { showCreateEvent, showCalendar, showEvent, showImport } from "./utils/utils.js";

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
    const importContainer = document.getElementById("importContainer");

    // Get the current month and year outside the if block
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // container dans index.html
    if (calendarContainer) {
      await showCalendar(calendarContainer, currentMonth, currentYear, refreshCalendar);
    }

     // container dans event.html
    if (eventContainer) {
      showCreateEvent(eventContainer, currentMonth, currentYear);
    }

     // container dans update-event.html
    if (eventUpdateContainer) {
      window.electron.onUpdateEvent((e: any, event: any) => {
        showEvent(event)
      });
    }

     // container dans import.html
    if (importContainer) {
      window.electron.onUpdateImport((e: any, event: any) => {
        showImport(event)
      });
    }
  } catch (err) {
    console.error(err);
  }
})();