import { IEvent } from "../../../interfaces/event.js"
import { formatDate } from "../date/formatDate.js";

export function showImport(event: IEvent) {
  // Create an import modal container
  const importModal = document.createElement("div");
  importModal.classList.add("import-modal");

  // Create a form for importing events
  const importForm = document.createElement("form");
  importForm.innerHTML = `
      <div class="event-card">
        <div class="event-card-element">
          <label for="event-titre">Title:</label>
          <input type="text" id="event-titre" name="event-titre" value="${event.titre
    }" required>
        </div>
        <div class="event-card-element">
          <label for="event-location">Location:</label>
          <input type="text" id="event-location" name="event-location" value="${event.location
    }" required>
        </div>
      </div>
      <div class="event-card">
        <div class="event-card-element">
          <label for="event-date-deb">Start Date:</label>
          <input type="datetime-local" id="event-date-deb" name="event-date-deb" value="${formatDate(
      event.date_deb
    )}" required>
        </div>
        <div class="event-card-element">
          <label for="event-date-fin">End Date:</label>
          <input type="datetime-local" id="event-date-fin" name="event-date-fin" value="${formatDate(
      event.date_fin
    )}" required>
        </div>
      </div>
  
      <div class="event-card">
        <label for="event-categorie">Category:</label>
        <input type="text" id="event-categorie" name="event-categorie" value="${event.categorie
    }" required>
      </div>
  
      <div class="event-card">
        <label for="event-statut">Status:</label>
        <select id="event-statut" name="event-statut" required>
          <option value="TENTATIVE" ${event.statut === "TENTATIVE" ? "selected" : ""
    }>Tentative</option>
          <option value="CONFIRMED" ${event.statut === "CONFIRMED" ? "selected" : ""
    }>Confirmed</option>
          <option value="CANCELED" ${event.statut === "CANCELED" ? "selected" : ""
    }>Canceled</option>
        </select>
      </div>
      
      <div class="event-card">
        <label for="event-transparence">Transparency:</label>
        <select id="event-transparence" name="event-transparence" required>
          <option value="OPAQUE" ${event.transparence === "OPAQUE" ? "selected" : ""
    }>Opaque</option>
          <option value="TRANSPARENT" ${event.transparence === "TRANSPARENT" ? "selected" : ""
    }>Transparent</option>
        </select>
      </div>
  
      <div class="event-card">
        <textarea id="event-description" placeholder="Description" name="event-description" required>${event.description
    }</textarea>
      </div>
  
      <button class="btn btn-1 btn-rad" type="submit">Apply Changes</button>
  
      <button class="btn btn-2 btn-rad" type="button" id="cancel-import">Cancel Import</button>
    `;

  // Add the form to the import modal
  importModal.appendChild(importForm);

  // Add the import modal to the main page
  document.body.appendChild(importModal);

  let nbMajUp: number;
  nbMajUp = event.nbMaj + 1;

  // Event handler for the Cancel Import button
  const cancelButton = importForm.querySelector("#cancel-import");
  cancelButton?.addEventListener("click", () => {
    window.electron.closeImportWindow();
  });

  importForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Get values from the form
    const importEvent: IEvent = {
      titre: (importForm.querySelector("#event-titre") as HTMLInputElement).value,
      location: (importForm.querySelector("#event-location") as HTMLInputElement).value,
      date_deb: new Date((importForm.querySelector("#event-date-deb") as HTMLInputElement).value),
      date_fin: new Date((importForm.querySelector("#event-date-fin") as HTMLInputElement).value),
      categorie: (importForm.querySelector("#event-categorie") as HTMLInputElement).value,
      statut: (importForm.querySelector("#event-statut") as HTMLSelectElement).value,
      transparence: (importForm.querySelector("#event-transparence") as HTMLSelectElement).value,
      description: (importForm.querySelector("#event-description") as HTMLTextAreaElement).value,
      nbMaj: nbMajUp,
    }

    try {
      // Create the event using the new values
      await window.electron.createEvent(importEvent);

      // Reload the main window
      await window.electron.reloadWindow();

      // Close the import window
      await window.electron.closeImportWindow();

    } catch (error) {
      console.error("Error while updating the event:", error);
    }
  });

  return importModal;
}
