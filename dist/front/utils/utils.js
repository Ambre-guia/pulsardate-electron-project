export async function showCalendar(container, targetMonth, targetYear, refreshCalendarCallback) {
    try {
        // Supprimer le contenu existant du conteneur
        container.innerHTML = "";
        // Créer l'élément header
        const calendarHeader = document.createElement("header");
        calendarHeader.classList.add("dflex");
        // Bouton précédent
        const previousButton = document.createElement("button");
        previousButton.textContent = "";
        previousButton.classList.add("left");
        previousButton.addEventListener("click", async () => {
            const newDate = new Date(targetYear, targetMonth - 1, 1);
            await showCalendar(container, newDate.getMonth(), newDate.getFullYear());
        });
        // Titre du mois
        const monthTitle = document.createElement("h1");
        monthTitle.classList.add("title");
        monthTitle.textContent = `${getMonthName(targetMonth)} ${targetYear}`;
        // Bouton suivant
        const nextButton = document.createElement("button");
        nextButton.textContent = "";
        nextButton.classList.add("right");
        nextButton.addEventListener("click", async () => {
            const newDate = new Date(targetYear, targetMonth + 1, 1);
            await showCalendar(container, newDate.getMonth(), newDate.getFullYear());
        });
        // Ajouter les éléments au header
        calendarHeader.appendChild(previousButton);
        calendarHeader.appendChild(monthTitle);
        calendarHeader.appendChild(nextButton);
        // Ajouter le header au container
        container.appendChild(calendarHeader);
        // Obtient tout les événements
        const events = await window.electron.getAll();
        // Crée une table pour le calendrier
        const calendarTable = document.createElement("table");
        // Crée la ligne d'en-tête avec les noms des jours
        const headerRow = document.createElement("tr");
        ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].forEach((day) => {
            const headerCell = document.createElement("th");
            headerCell.textContent = day;
            headerRow.appendChild(headerCell);
        });
        calendarTable.appendChild(headerRow);
        // Calcule le nombre de jours dans le mois
        const daysInMonth = new Date(targetYear, targetMonth + 1, 0).getDate();
        // Calcule le jour de la semaine pour le premier jour du mois
        const startDayOfWeek = new Date(targetYear, targetMonth, 1).getDay();
        // Obtient le jour actuel
        const currentDate = new Date();
        const actualDay = currentDate;
        const actualMonth = currentDate.getMonth();
        const actualYear = currentDate.getFullYear();
        let dayIndex = 1;
        for (let i = 0; i < 6; i++) {
            const calendarRow = document.createElement("tr");
            let rowIsEmpty = true; // Variable pour suivre si la ligne est vide
            for (let j = 0; j < 7; j++) {
                const calendarCell = document.createElement("td");
                const eventCell = document.createElement("div");
                calendarCell.classList.add("day");
                eventCell.classList.add("event");
                // Obtient la date du jour actuel dans la boucle
                const currentDate = new Date(targetYear, targetMonth, dayIndex);
                // Affiche les événements pour cette date
                const eventsForDay = events.filter((event) => {
                    const eventStartDate = new Date(event.date_deb);
                    const eventEndDate = new Date(event.date_fin);
                    // Récupère la date sans tenir compte de l'heure, des minutes, etc.
                    const currentDateWithoutTime = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
                    const eventStartDateWithoutTime = new Date(eventStartDate.getFullYear(), eventStartDate.getMonth(), eventStartDate.getDate());
                    const eventEndDateWithoutTime = new Date(eventEndDate.getFullYear(), eventEndDate.getMonth(), eventEndDate.getDate());
                    // Vérifie si la date actuelle est comprise entre la date de début (inclus) et la date de fin de l'événement
                    return (currentDateWithoutTime.getTime() >=
                        eventStartDateWithoutTime.getTime() &&
                        currentDateWithoutTime.getTime() <= eventEndDateWithoutTime.getTime());
                });
                // Remplit la cellule avec le jour s'il est dans le mois
                if (i === 0 && j < startDayOfWeek) {
                    // Ajoute des cellules vides pour les jours avant le début du mois
                    calendarCell.textContent = "";
                }
                else if (dayIndex <= daysInMonth) {
                    // Ajoute les jours du mois
                    calendarCell.textContent = `${dayIndex}`;
                    // Ajoute la classe "actualDay" si c'est le jour actuel
                    if (currentDate.getFullYear() === actualYear &&
                        currentDate.getMonth() === actualMonth &&
                        dayIndex === actualDay.getDate()) {
                        calendarCell.classList.add("actualDay");
                    }
                    // Ajoute la cellule d'événement seulement s'il y a des événements pour ce jour
                    if (eventsForDay.length > 0) {
                        eventsForDay.forEach((event) => {
                            const eventElement = document.createElement("div");
                            eventElement.textContent = event.titre;
                            // Add the click event listener to each eventElement
                            eventElement.addEventListener("click", async () => {
                                // Ouvrir la fenêtre de mise à jour ici
                                //window.electron.createUpdateWindow();
                                showUpdateEvent(event.id);
                            });
                            eventCell.appendChild(eventElement);
                        });
                    }
                    dayIndex++;
                    rowIsEmpty = false; // La ligne n'est pas vide
                }
                calendarCell.appendChild(eventCell);
                calendarRow.appendChild(calendarCell);
            }
            // Vérifie si la ligne n'est pas vide avant de l'ajouter
            if (!rowIsEmpty) {
                calendarTable.appendChild(calendarRow);
            }
        }
        // Ajoute la table du calendrier au conteneur
        container.appendChild(calendarTable);
        // Call the refresh function if it's provided
        if (refreshCalendarCallback) {
            refreshCalendarCallback(container, targetMonth, targetYear);
        }
    }
    catch (error) {
        console.error("Erreur lors de la récupération des données du calendrier :", error);
    }
}
function getMonthName(monthNumber) {
    const months = [
        "Janvier",
        "Février",
        "Mars",
        "Avril",
        "Mai",
        "Juin",
        "Juillet",
        "Août",
        "Septembre",
        "Octobre",
        "Novembre",
        "Décembre",
    ];
    return months[monthNumber];
}
export function showCreateEvent(container, targetMonth, targetYear) {
    const createEventModal = document.createElement("div");
    createEventModal.classList.add("create-event-modal");
    // Crée le formulaire de création d'événement
    const eventForm = document.createElement("form");
    eventForm.innerHTML = `
  <div class="event-card">
    <div class="event-card-element">
      <label for="event-titre">Titre:</label>
      <input type="text" id="event-titre" name="event-titre" required>
    </div>
    <div class="event-card-element">
      <label for="event-location">Location:</label>
      <input type="text" id="event-location" name="event-location" required>
    </div>
  </div>
  <div class="event-card">
    <div class="event-card-element">
      <label for="event-date-deb">Date de début:</label>
      <input type="datetime-local" id="event-date-deb" name="event-date-deb" required>
    </div>
    <div class="event-card-element">
      <label for="event-date-fin">Date de fin:</label>
      <input type="datetime-local" id="event-date-fin" name="event-date-fin" required>
    </div>
  </div>

  <div class="event-card">
    <label for="event-categorie">Catégorie:</label>
    <input type="text" id="event-categorie" name="event-categorie" required>
  </div>

  <div class="event-card">
    <label for="event-statut">Statut:</label>
    <select id="event-statut" name="event-statut" required>
      <option value="TENTATIVE">Tentative</option>
      <option value="CONFIRMED">Confirmé</option>
      <option value="CANCELED">Annulé</option>
    </select>
  </div>
  
  <div class="event-card">
    <label for="event-transparence">Transparence:</label>
    <select id="event-transparence" name="event-transparence" required>
      <option value="OPAQUE">Opaque</option>
      <option value="TRANSPARENT">Transparent</option>
    </select>
  </div>

  <div class="event-card">
    <textarea id="event-description" placeholder="Description" name="event-description" required></textarea>
  </div>

    <button class="btn btn-1" type="submit">Créer l'événement</button>`;
    // Ajoute un gestionnaire d'événement pour le formulaire de création d'événement
    eventForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        // Récupère les valeurs du formulaire
        const eventDateDeb = eventForm.querySelector("#event-date-deb").value;
        const eventDateFin = eventForm.querySelector("#event-date-fin").value;
        const eventTitre = eventForm.querySelector("#event-titre").value;
        const eventLocation = eventForm.querySelector("#event-location").value;
        const eventCategorie = eventForm.querySelector("#event-categorie").value;
        const eventStatut = eventForm.querySelector("#event-statut").value;
        const eventDescription = eventForm.querySelector("#event-description").value;
        const eventTransparence = eventForm.querySelector("#event-transparence").value;
        if (new Date(eventDateFin) <= new Date(eventDateDeb)) {
            alert("La date de fin doit être ultérieure à la date de début.");
            return;
        }
        // Définit nbMaj à 1
        const eventNbMaj = 1;
        // Crée un objet IEvent avec les valeurs récupérées
        const newEvent = {
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
        // Vous pouvez envoyer cet objet à votre backend via IPC pour créer l'événement
        try {
            await window.electron.createEvent(newEvent);
            window.electron.closeWindow();
            window.electron.reloadWindow();
        }
        catch (error) {
            console.error("Erreur lors de la création de l'événement :", error);
            // Gérer l'erreur de création d'événement
            // Vous pourriez afficher un message à l'utilisateur ou effectuer d'autres actions
        }
    });
    // Ajoute le formulaire à la fenêtre modale
    createEventModal.appendChild(eventForm);
    // Ajoute la fenêtre modale à la page principale
    document.body.appendChild(createEventModal);
}
export function showUpdateEvent(eventId) {
    try {
        window.electron.createUpdateWindowEvent(eventId);
    }
    catch (err) {
        console.error(err);
    }
}
export function updateEventForm(event) {
    const updateEventModal = document.createElement("div");
    updateEventModal.classList.add("update-event-modal");
    // Crée le formulaire de modification d'événement
    const updateEventForm = document.createElement("form");
    updateEventForm.innerHTML = `
    <div class="event-card">
      <div class="event-card-element">
        <label for="event-titre">Titre:</label>
        <input type="text" id="event-titre" name="event-titre" value="${event.titre}" required>
      </div>
      <div class="event-card-element">
        <label for="event-location">Location:</label>
        <input type="text" id="event-location" name="event-location" value="${event.location}" required>
      </div>
    </div>
    <div class="event-card">
      <div class="event-card-element">
        <label for="event-date-deb">Date de début:</label>
        <input type="datetime-local" id="event-date-deb" name="event-date-deb" value="${formatDate(event.date_deb)}" required>
      </div>
      <div class="event-card-element">
        <label for="event-date-fin">Date de fin:</label>
        <input type="datetime-local" id="event-date-fin" name="event-date-fin" value="${formatDate(event.date_fin)}" required>
      </div>
    </div>

    <div class="event-card">
      <label for="event-categorie">Catégorie:</label>
      <input type="text" id="event-categorie" name="event-categorie" value="${event.categorie}" required>
    </div>

    <div class="event-card">
      <label for="event-statut">Statut:</label>
      <select id="event-statut" name="event-statut" required>
        <option value="TENTATIVE" ${event.statut === "TENTATIVE" ? "selected" : ""}>Tentative</option>
        <option value="CONFIRMED" ${event.statut === "CONFIRMED" ? "selected" : ""}>Confirmé</option>
        <option value="CANCELED" ${event.statut === "CANCELED" ? "selected" : ""}>Annulé</option>
      </select>
    </div>
    
    <div class="event-card">
      <label for="event-transparence">Transparence:</label>
      <select id="event-transparence" name="event-transparence" required>
        <option value="OPAQUE" ${event.transparence === "OPAQUE" ? "selected" : ""}>Opaque</option>
        <option value="TRANSPARENT" ${event.transparence === "TRANSPARENT" ? "selected" : ""}>Transparent</option>
      </select>
    </div>

    <div class="event-card">
      <textarea id="event-description" placeholder="Description" name="event-description" required>${event.description}</textarea>
    </div>

    <button class="btn btn-1 btn-rad" type="submit">Appliquer la modification</button>
  `;
    // Ajoute le formulaire à la fenêtre modale de modification
    updateEventModal.appendChild(updateEventForm);
    // Ajoute la fenêtre modale de modification à la page principale
    document.body.appendChild(updateEventModal);
    let nbMajUp;
    nbMajUp = event.nbMaj + 1;
    let eventId;
    eventId = event.id;
    // Handle form submission here
    updateEventForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const updatedEvent = {
            titre: updateEventForm.querySelector("#event-titre").value,
            location: updateEventForm.querySelector("#event-location").value,
            date_deb: new Date(updateEventForm.querySelector("#event-date-deb").value),
            date_fin: new Date(updateEventForm.querySelector("#event-date-fin").value),
            categorie: updateEventForm.querySelector("#event-categorie").value,
            statut: updateEventForm.querySelector("#event-statut").value,
            transparence: updateEventForm.querySelector("#event-transparence").value,
            description: updateEventForm.querySelector("#event-description").value,
            nbMaj: nbMajUp,
        };
        try {
            // Update the event using the new values
            await window.electron.updateEvent(eventId, updatedEvent);
            await window.electron.reloadUpdateWindow(eventId);
            window.electron.reloadWindow();
            // Close the update event modal
            closeUpdateEventForm(updateEventModal);
        }
        catch (error) {
            console.error("Erreur lors de la mise à jour de l'événement :", error);
            // Handle the event update error
            // You could display a message to the user or take other actions
        }
    });
    return updateEventModal;
}
// Variable pour suivre l'état du formulaire
let isFormOpen = false;
export function closeUpdateEventForm(updateEventModal) {
    // Supprime la fenêtre modale de modification de la page
    if (updateEventModal) {
        document.body.removeChild(updateEventModal);
    }
    // Met à jour l'état du formulaire
    isFormOpen = false;
}
// Mettez à jour la fonction formatDate :
export function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}
export function generateICS(event) {
    const lignesICS = [];
    lignesICS.push('BEGIN:VCALENDAR');
    lignesICS.push('VERSION:2.0');
    lignesICS.push('PRODID:-//PULSARDATE-ELECTRON-PROJECT//FR');
    lignesICS.push('BEGIN:VEVENT');
    lignesICS.push(`SUMMARY:${event.titre}`);
    lignesICS.push(`DESCRIPTION:${event.description}`);
    lignesICS.push(`LOCATION:${event.location}`);
    lignesICS.push(`DTSTART:${formatDateForICS(event.date_deb)}`);
    lignesICS.push(`DTEND:${formatDateForICS(event.date_fin)}`);
    lignesICS.push(`CATEGORIES:${event.categorie}`);
    lignesICS.push(`STATUS:${event.statut}`);
    lignesICS.push(`TRANSP:${event.transparence}`);
    lignesICS.push('END:VEVENT');
    lignesICS.push('END:VCALENDAR');
    const icsContent = lignesICS.join('\r\n');
    return icsContent;
}
export function formatDateForICS(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
