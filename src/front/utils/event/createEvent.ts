import { IEvent } from "../../../interfaces/event.js";

export function showCreateEvent(
  container: HTMLElement,
  targetMonth: number,
  targetYear: number,
) {
  const createEventModal = document.createElement("div");
  createEventModal.classList.add("create-event-modal");

  // Create the event creation form
  const eventForm = document.createElement("form");
  eventForm.innerHTML = `
    <div class="event-card">
      <div class="event-card-element">
        <label for="event-titre">Title:</label>
        <input type="text" id="event-titre" name="event-titre" required>
      </div>
      <div class="event-card-element">
        <label for="event-location">Location:</label>
        <input type="text" id="event-location" name="event-location" required>
      </div>
    </div>
    <div class="event-card">
      <div class="event-card-element">
        <label for="event-date-deb">Start Date:</label>
        <input type="datetime-local" id="event-date-deb" name="event-date-deb" required>
      </div>
      <div class="event-card-element">
        <label for="event-date-fin">End Date:</label>
        <input type="datetime-local" id="event-date-fin" name="event-date-fin" required>
      </div>
    </div>

    <div class="event-card">
      <label for="event-categorie">Category:</label>
      <input type="text" id="event-categorie" name="event-categorie" required>
    </div>

    <div class="event-card">
      <label for="event-statut">Status:</label>
      <select id="event-statut" name="event-statut" required>
        <option value="TENTATIVE">Tentative</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="CANCELED">Canceled</option>
      </select>
    </div>
    
    <div class="event-card">
      <label for="event-transparence">Transparency:</label>
      <select id="event-transparence" name="event-transparence" required>
        <option value="OPAQUE">Opaque</option>
        <option value="TRANSPARENT">Transparent</option>
      </select>
    </div>

    <div class="event-card">
      <textarea id="event-description" placeholder="Description" name="event-description" required></textarea>
    </div>

    <button class="btn btn-1" type="submit">Create Event</button>`
    ;

  // Add an event handler for the event creation form
  eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Get values from the form
    const eventDateDeb = (
      eventForm.querySelector("#event-date-deb") as HTMLInputElement
    ).value;
    const eventDateFin = (
      eventForm.querySelector("#event-date-fin") as HTMLInputElement
    ).value;
    const eventTitre = (
      eventForm.querySelector("#event-titre") as HTMLInputElement
    ).value;
    const eventLocation = (
      eventForm.querySelector("#event-location") as HTMLInputElement
    ).value;
    const eventCategorie = (
      eventForm.querySelector("#event-categorie") as HTMLInputElement
    ).value;
    const eventStatut = (
      eventForm.querySelector("#event-statut") as HTMLSelectElement
    ).value;
    const eventDescription = (
      eventForm.querySelector("#event-description") as HTMLTextAreaElement
    ).value;
    const eventTransparence = (
      eventForm.querySelector("#event-transparence") as HTMLSelectElement
    ).value;

    if (new Date(eventDateFin) <= new Date(eventDateDeb)) {
      alert("End date must be after the start date.");
      return;
    }

    // Check for empty required fields
    if (
      !eventTitre ||
      !eventLocation ||
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

    // Check for valid values of certain fields
    const allowedStatuts = ["TENTATIVE", "CONFIRMED", "CANCELED"];
    
    if (!allowedStatuts.includes(eventStatut)) {
      alert("Invalid value for status.");
      return;
    }
    
    const allowedTransparences = ["OPAQUE", "TRANSPARENT"];

    if (!allowedTransparences.includes(eventTransparence)) {
      alert("Invalid value for transparency.");
      return;
    }

    // Set nbMaj to 1
    const eventNbMaj = 1;

    // Create an IEvent object with the retrieved values
    const newEvent: IEvent = {
      date_deb: new Date(eventDateDeb),
      date_fin: new Date(eventDateFin),
      titre: eventTitre,
      location: eventLocation,
      categorie: eventCategorie,
      statut: eventStatut,
      description: eventDescription,
      transparence: eventTransparence,
      nbMaj: eventNbMaj,
    };

    try {
      await window.electron.createEvent(newEvent);

      window.electron.closeWindow();
      window.electron.reloadWindow();
    } catch (error) {
      console.error("Error creating the event:", error);
      alert("Error creating the event. Please try again.");
    }
  });

  // Add the form to the modal window
  createEventModal.appendChild(eventForm);

  // Add the modal window to the main page
  document.body.appendChild(createEventModal);
}
