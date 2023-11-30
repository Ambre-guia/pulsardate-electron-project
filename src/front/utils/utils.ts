import { IEvent } from "../../interfaces/event";

export async function showCalendar(container: HTMLElement): Promise<void> {
  // Efface le contenu existant dans le conteneur
  container.innerHTML = "";

  try {
    // Obtient le mois et l'année actuels
    const currentMonth = await window.electron.getCurrentMonth();
    const currentYear = await window.electron.getCurrentYear();

    // Obtient le premier et le dernier jour du mois
    const firstDayOfMonth = await window.electron.getFirstDayOfMonth(currentMonth, currentYear);
    const lastDayOfMonth = await window.electron.getLastDayOfMonth(currentMonth, currentYear);

    // Crée une table pour le calendrier
    const calendarTable = document.createElement("table");

    // Crée la ligne d'en-tête avec les noms des jours (ajuster si nécessaire)
    const headerRow = document.createElement("tr");
    ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].forEach((day) => {
      const headerCell = document.createElement("th");
      headerCell.textContent = day;
      headerRow.appendChild(headerCell);
    });
    calendarTable.appendChild(headerRow);

    // Calcule le nombre de jours dans le mois
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    // Calcule le jour de la semaine pour le premier jour du mois
    const startDayOfWeek = firstDayOfMonth.getDay();

    // Crée des lignes et des cellules pour chaque jour du mois
    let currentDay = 1;
    for (let i = 0; i < 6; i++) {
      const calendarRow = document.createElement("tr");
      for (let j = 0; j < 7; j++) {
        const calendarCell = document.createElement("td");

        // Remplit la cellule avec le jour s'il est dans le mois
        if (i === 0 && j < startDayOfWeek) {
          // Ajoute des cellules vides pour les jours avant le début du mois
          calendarCell.textContent = "";
        } else if (currentDay <= daysInMonth) {
          // Ajoute les jours du mois
          calendarCell.textContent = `${currentDay}`;
          currentDay++;
        }

        calendarRow.appendChild(calendarCell);
      }
      calendarTable.appendChild(calendarRow);
    }

    // Ajoute la table du calendrier au conteneur
    container.appendChild(calendarTable);

  } catch (error) {
    console.error("Erreur lors de la récupération des données du calendrier :", error);
  }
}


export function showEvents(events: IEvent[], elem: HTMLElement) {
 /*  elem.innerHTML = "";
  events.forEach((event) => {
    const ligne = document.createElement("tr");
    const utils = document.createElement("td");
    const supp = document.createElement("button");
    const modif = document.createElement("button");

    // Customize the event display as needed
    utils.textContent = `${event.title} - ${event.date}`;
    supp.textContent = "Delete";
    modif.textContent = "Edit";

    // Append buttons to the row
    ligne.appendChild(utils);
    ligne.appendChild(supp);
    ligne.appendChild(modif);

    // Append the row to the container
    elem.appendChild(ligne);
  });*/
}
 