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

    // Get values from the form
    const eventTitre = (updateEventForm.querySelector("#event-titre") as HTMLInputElement).value;
    const eventLocation = (updateEventForm.querySelector("#event-location") as HTMLInputElement).value;
    const eventDateDeb = (updateEventForm.querySelector("#event-date-deb") as HTMLInputElement).value;
    const eventDateFin = (updateEventForm.querySelector("#event-date-fin") as HTMLInputElement).value;
    const eventCategorie = (updateEventForm.querySelector("#event-categorie") as HTMLInputElement).value;
    const eventStatut = (updateEventForm.querySelector("#event-statut") as HTMLSelectElement).value;
    const eventTransparence = (updateEventForm.querySelector("#event-transparence") as HTMLSelectElement).value;
    const eventDescription = (updateEventForm.querySelector("#event-description") as HTMLTextAreaElement).value;

    // Check for empty required fields
    if (
      !eventTitre ||
      !eventLocation ||
      !eventDateDeb ||
      !eventDateFin ||
      !eventCategorie ||
      !eventStatut ||
      !eventTransparence ||
      !eventDescription
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    // Check for valid dates
    if (isNaN(new Date(eventDateDeb).getTime()) || isNaN(new Date(eventDateFin).getTime())) {
      alert("Invalid date format.");
      return;
    }

    // Check if the end date is after the start date
    if (new Date(eventDateFin) <= new Date(eventDateDeb)) {
      alert("End date must be after the start date.");
      return;
    }

    // Check for valid values of certain fields
    const allowedStatuts = ["TENTATIVE", "CONFIRMED", "CANCELED"];
    
    if (!allowedStatuts.includes(eventStatut)) {
      alert("Invalid value for status.");
      return;
    }

    const allowedTransparences = ["OPAQUE", "TRANSPARENT"];

    if ( !allowedTransparences.includes(eventTransparence)) {
        alert("Invalid value for transparency.");
        return;
      }

    try {
      const updatedEvent: IEvent = {
        titre: eventTitre,
        location: eventLocation,
        date_deb: new Date(eventDateDeb),
        date_fin: new Date(eventDateFin),
        categorie: eventCategorie,
        statut: eventStatut,
        transparence: eventTransparence,
        description: eventDescription,
        nbMaj: nbMajUp,
      };

      // Update the event using the new values
      await window.electron.updateEvent(eventId, updatedEvent);

      await window.electron.reloadUpdateWindow(eventId);

      window.electron.reloadWindow();
      // Close the update event modal
      closeUpdateEventForm(updateEventModal);
    } catch (error) {
      console.error("Error updating the event:", error);
      alert("Error updating the event. Please try again.");
    }
});

  return updateEventModal;
}
