export async function showCalendar(container, targetMonth, targetYear) {
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
        // Obtient le premier et le dernier jour du mois cible
        const firstDayOfMonth = await window.electron.getFirstDayOfMonth(targetMonth, targetYear);
        const lastDayOfMonth = await window.electron.getLastDayOfMonth(targetMonth, targetYear);
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
        const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
        // Calcule le jour de la semaine pour le premier jour du mois
        const startDayOfWeek = new Date(targetYear, targetMonth, 1).getDay();
        // Obtient le jour actuel
        const currentDate = new Date();
        const currentDay = currentDate.getDate();
        // Crée des lignes et des cellules pour chaque jour du mois
        let dayIndex = 1;
        for (let i = 0; i < 6; i++) {
            const calendarRow = document.createElement("tr");
            let rowIsEmpty = true; // Variable pour suivre si la ligne est vide
            for (let j = 0; j < 7; j++) {
                const calendarCell = document.createElement("td");
                const eventCell = document.createElement("div");
                calendarCell.classList.add("day");
                // Remplit la cellule avec le jour s'il est dans le mois
                if (i === 0 && j < startDayOfWeek) {
                    // Ajoute des cellules vides pour les jours avant le début du mois
                    calendarCell.textContent = "";
                }
                else if (dayIndex <= daysInMonth) {
                    // Ajoute les jours du mois
                    calendarCell.textContent = `${dayIndex}`;
                    // Ajoute la classe "actualDay" si c'est le jour actuel
                    if (dayIndex === currentDay &&
                        targetMonth === currentDate.getMonth() &&
                        targetYear === currentDate.getFullYear()) {
                        calendarCell.classList.add("actualDay");
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
        // Crée le titre du calendrier avec le mois et l'année cibles
        console.log(targetYear, targetMonth);
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
    // Ajuste le numéro du mois pour qu'il soit dans la plage de 0 à 11
    const adjustedMonthNumber = (monthNumber + 12) % 12;
    return months[adjustedMonthNumber];
}
export function showCreateEvent() {
    // Crée une fenêtre modale pour le formulaire de création d'événement
    const createEventModal = document.createElement("div");
    createEventModal.classList.add("create-event-modal");
    // Crée le formulaire de création d'événement
    const eventForm = document.createElement("form");
    eventForm.innerHTML = `
    <label for="event-date-deb">Date de début:</label>
    <input type="date" id="event-date-deb" name="event-date-deb" required><br>

    <label for="event-date-fin">Date de fin:</label>
    <input type="date" id="event-date-fin" name="event-date-fin" required><br>

    <label for="event-titre">Titre:</label>
    <input type="text" id="event-titre" name="event-titre" required><br>

    <label for="event-location">Location:</label>
    <input type="text" id="event-location" name="event-location" required><br>

    <label for="event-categorie">Catégorie:</label>
    <input type="text" id="event-categorie" name="event-categorie" required><br>

    <label for="event-statut">Statut:</label>
    <select id="event-statut" name="event-statut" required>
      <option value="TENTATIVE">Tentative</option>
      <option value="CONFIRMED">Confirmé</option>
      <option value="CANCELED">Annulé</option>
    </select><br>

    <label for="event-description">Description:</label>
    <textarea id="event-description" name="event-description" required></textarea><br>

    <label for="event-transparence">Transparence:</label>
    <select id="event-transparence" name="event-transparence" required>
      <option value="OPAQUE">Opaque</option>
      <option value="TRANSPARENT">Transparent</option>
    </select><br>

    <!-- Champ nbMaj retiré -->

    <button type="submit">Créer l'événement</button>
  `;
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
            // Ferme la fenêtre modale après la création de l'événement (à implémenter)
            createEventModal.style.display = "none";
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
