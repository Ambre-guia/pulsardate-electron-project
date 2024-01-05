import { IEvent } from "../../../interfaces/event.js";
import { formatDate } from "../date/formatDate.js";
import { generateICS } from "../import/generateICS.js";
import { toggleUpdateEventForm } from "./toggleUpdateEventForm.js";

let isFormOpen: boolean;

export function showEvent(event: IEvent) {
    const showEventContainer = document.createElement("div");
    showEventContainer.classList.add("show-event-container");

    // Display basic event information
    const basicEventInfo = document.createElement("div");
    basicEventInfo.innerHTML = `
      <h2>${event.titre}</h2>
      <p>Location: ${event.location}</p>
      <p>Start Date: ${formatDate(event.date_deb)}</p>
      <p>End Date: ${formatDate(event.date_fin)}</p>
      <p>Category: ${event.categorie}</p>
      <p>Status: ${event.statut}</p>
      <p>Transparency: ${event.transparence}</p>
      <p>Description: ${event.description}</p>
    `;
    showEventContainer.appendChild(basicEventInfo);

    // Add a button to open/close the update form
    const editButton = document.createElement("button");
    editButton.classList.add("btn");
    editButton.classList.add("btn-1");
    editButton.classList.add("btn-rad");
    editButton.textContent = isFormOpen ? "Cancel" : "Edit Event";
    editButton.addEventListener("click", () => {
        try {
            toggleUpdateEventForm(event);
        } catch (error) {
            console.error("Error toggling update form:", error);
            alert("An error occurred while trying to edit the event. Please try again.");
        }
    });
    showEventContainer.appendChild(editButton);

    // Add a button to delete the event
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn");
    deleteButton.classList.add("btn-2");
    deleteButton.classList.add("btn-rad");
    deleteButton.textContent = "Delete Event";
    deleteButton.addEventListener("click", () => {
        try {
            window.electron.deleteEvent(event.id);
            window.electron.reloadWindow();
            window.electron.closeUpdateWindow();
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("An error occurred while trying to delete the event. Please try again.");
        }
    });
    showEventContainer.appendChild(deleteButton);

    // Add a button to generate an ICS file
    const generateICSButton = document.createElement("button");
    generateICSButton.textContent = "Generate ICS";
    generateICSButton.classList.add("btn");
    generateICSButton.classList.add("btn-download");
    generateICSButton.addEventListener("click", () => {
        try {
            const icsContent = generateICS(event);

            // Generate a unique file name
            const fileName = `event_${event.id}.ics`;

            // Create a Blob object with the ICS content and the appropriate MIME type
            const blob = new Blob([icsContent], { type: "text/calendar" });

            // Create a URL object from the Blob
            const url = URL.createObjectURL(blob);

            // Create a link to download the file
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;

            // Add the link to the page and trigger the click to start the download
            document.body.appendChild(link);
            link.click();

            // Clean up the URL of the Blob object after the download
            URL.revokeObjectURL(url);

            // Remove the link from the page
            document.body.removeChild(link);
        } catch (error) {
            console.error("Error generating ICS:", error);
            alert("An error occurred while trying to generate the ICS file. Please try again.");
        }
    });
    showEventContainer.appendChild(generateICSButton);

    // Add a button to close the window
    const closeButton = document.createElement("button");
    closeButton.classList.add("btn");
    closeButton.classList.add("btn-3");
    closeButton.textContent = "Close Window";
    closeButton.addEventListener("click", () => {
        try {
            window.electron.closeUpdateWindow();
        } catch (error) {
            console.error("Error closing window:", error);
            alert("An error occurred while trying to close the window. Please try again.");
        }
    });
    showEventContainer.appendChild(closeButton);

    // Add the container to the main page
    document.body.appendChild(showEventContainer);
}