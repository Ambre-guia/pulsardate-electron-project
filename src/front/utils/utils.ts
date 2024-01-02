import { IEvent } from "../../interfaces/event.js";

export async function showCalendar(
  container: HTMLElement,
  targetMonth: number,
  targetYear: number
): Promise<void> {
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
    const firstDayOfMonth = await window.electron.getFirstDayOfMonth(
      targetMonth,
      targetYear
    );
    const lastDayOfMonth = await window.electron.getLastDayOfMonth(
      targetMonth,
      targetYear
    );

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
    const currentDay = currentDate.getDate();

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

          // Vérifie si la date actuelle est comprise entre la date de début (inclus) et la date de fin de l'événement
          return currentDate.getTime() >= eventStartDate.getTime() && currentDate.getTime() <= eventEndDate.getTime();
        });

        // Remplit la cellule avec le jour s'il est dans le mois
        if (i === 0 && j < startDayOfWeek) {
          // Ajoute des cellules vides pour les jours avant le début du mois
          calendarCell.textContent = "";
        } else if (dayIndex <= daysInMonth) {
          // Ajoute les jours du mois
          calendarCell.textContent = `${dayIndex}`;

          // Ajoute la classe "actualDay" si c'est le jour actuel
          if (
            dayIndex === currentDay &&
            targetMonth === currentDate.getMonth() &&
            targetYear === currentDate.getFullYear()
          ) {
            calendarCell.classList.add("actualDay");
          }

          // Ajoute la cellule d'événement seulement s'il y a des événements pour ce jour
          if (eventsForDay.length > 0) {
            console.log(currentDate);
            
            eventsForDay.forEach((event) => {
              const eventElement = document.createElement("div");
              eventElement.textContent = event.titre; // Vous pouvez personnaliser ceci
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

    // Crée le titre du calendrier avec le mois et l'année cibles
    console.log(targetYear, targetMonth);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données du calendrier :",
      error
    );
  }
}

function getMonthName(monthNumber: number): string {
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

export function showCreateEvent() {
  // Crée une fenêtre modale pour le formulaire de création d'événement
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
      <input type="date" id="event-date-deb" name="event-date-deb" required>
    </div>
    <div class="event-card-element">
      <label for="event-date-fin">Date de fin:</label>
      <input type="date" id="event-date-fin" name="event-date-fin" required>
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

    <button type="submit">Créer l'événement</button>`
  ;

  // Ajoute un gestionnaire d'événement pour le formulaire de création d'événement
  eventForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    // Récupère les valeurs du formulaire
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

    // Définit nbMaj à 1
    const eventNbMaj = 1;

    // Crée un objet IEvent avec les valeurs récupérées
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

    // Vous pouvez envoyer cet objet à votre backend via IPC pour créer l'événement
    try {
      await window.electron.createEvent(newEvent);
      // Ferme la fenêtre modale après la création de l'événement (à implémenter)
      createEventModal.style.display = "none";
    } catch (error) {
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
