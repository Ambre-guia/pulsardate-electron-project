import { IEvent } from "../../../interfaces/event.js";
import { formatDate } from "../date/formatDate.js";
import { closeUpdateEventForm } from "./closeUpdateEventForm.js";

export function updateEventForm(event: IEvent) {
  const updateEventModal = document.createElement("div");
  updateEventModal.classList.add("update-event-modal");

  // Create the event modification form
  const updateEventForm = document.createElement("form");
  updateEventForm.innerHTML = `
        <div class="event-card">
            <div class="event-card-element">
                <label for="event-titre">Title:</label>
                <input type="text" id="event-titre" name="event-titre" value="${event.titre}" required>
            </div>
            <div class="event-card-element">
                <label for="event-location">Location:</label>
                <input type="text" id="event-location" name="event-location" value="${event.location}" required>
            </div>
        </div>
        <div class="event-card">
            <div class="event-card-element">
                <label for="event-date-deb">Start Date:</label>
                <input type="datetime-local" id="event-date-deb" name="event-date-deb" value="${formatDate(event.date_deb)}" required>
            </div>
            <div class="event-card-element">
                <label for="event-date-fin">End Date:</label>
                <input type="datetime-local" id="event-date-fin" name="event-date-fin" value="${formatDate(event.date_fin)}" required>
            </div>
        </div>

        <div class="event-card">
            <label for="event-categorie">Category:</label>
            <input type="text" id="event-categorie" name="event-categorie" value="${event.categorie}" required>
        </div>

        <div class="event-card">
            <label for="event-statut">Status:</label>
            <select id="event-statut" name="event-statut" required>
                <option value="TENTATIVE" ${event.statut === "TENTATIVE" ? "selected" : ""}>Tentative</option>
                <option value="CONFIRMED" ${event.statut === "CONFIRMED" ? "selected" : ""}>Confirmed</option>
                <option value="CANCELED" ${event.statut === "CANCELED" ? "selected" : ""}>Canceled</option>
            </select>
        </div>

        <div class="event-card">
            <label for="event-transparence">Transparency:</label>
            <select id="event-transparence" name="event-transparence" required>
                <option value="OPAQUE" ${event.transparence === "OPAQUE" ? "selected" : ""}>Opaque</option>
                <option value="TRANSPARENT" ${event.transparence === "TRANSPARENT" ? "selected" : ""}>Transparent</option>
            </select>
        </div>

        <div class="event-card">
            <textarea id="event-description" placeholder="Description" name="event-description" required>${event.description}</textarea>
        </div>

        <button class="btn btn-1 btn-rad" type="submit">Apply Modification</button>
    `;

  // Add the form to the update event modal
  updateEventModal.appendChild(updateEventForm);

  // Add the update event modal to the main page
  document.body.appendChild(updateEventModal);

  let nbMajUp: number;
  nbMajUp = event.nbMaj + 1;
  let eventId: number;
  eventId = event.id;

  // Handle form submission here
  updateEventForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const updatedEvent: IEvent = {
      titre: (updateEventForm.querySelector("#event-titre") as HTMLInputElement).value,
      location: (updateEventForm.querySelector("#event-location") as HTMLInputElement).value,
      date_deb: new Date((updateEventForm.querySelector("#event-date-deb") as HTMLInputElement).value),
      date_fin: new Date((updateEventForm.querySelector("#event-date-fin") as HTMLInputElement).value),
      categorie: (updateEventForm.querySelector("#event-categorie") as HTMLInputElement).value,
      statut: (updateEventForm.querySelector("#event-statut") as HTMLSelectElement).value,
      transparence: (updateEventForm.querySelector("#event-transparence") as HTMLSelectElement).value,
      description: (updateEventForm.querySelector("#event-description") as HTMLTextAreaElement).value,
      nbMaj: nbMajUp,
    };

    try {
      // Update the event using the new values
      await window.electron.updateEvent(eventId, updatedEvent);

      await window.electron.reloadUpdateWindow(eventId);

      window.electron.reloadWindow();
      // Close the update event modal
      closeUpdateEventForm(updateEventModal);
    } catch (error) {
      console.error("Error updating the event:", error);
    }
  });

  return updateEventModal;
}
