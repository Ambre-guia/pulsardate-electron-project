export async function showCalendar(
  container: HTMLElement,
  targetMonth: number,
  targetYear: number
): Promise<void> {
  // Efface le contenu existant dans le conteneur
  container.innerHTML = "";

  try {
    // Obtient le premier et le dernier jour du mois cible
    const firstDayOfMonth = await window.electron.getFirstDayOfMonth(
      targetMonth,
      targetYear
    );
    const lastDayOfMonth = await window.electron.getLastDayOfMonth(
      targetMonth,
      targetYear
    );

    console.log(firstDayOfMonth, "ici");

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

    // Crée des lignes et des cellules pour chaque jour du mois
    let currentDay = 1;
    for (let i = 0; i < 6; i++) {
      const calendarRow = document.createElement("tr");
      let rowIsEmpty = true; // Variable pour suivre si la ligne est vide

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
          rowIsEmpty = false; // La ligne n'est pas vide
        }

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

    const calendarTitle = document.createElement("caption");
    calendarTitle.textContent = `${getMonthName(targetMonth)} ${targetYear}`;
    calendarTable.appendChild(calendarTitle);

    // Ajoute des boutons de navigation pour les mois précédents et suivants
    const navigationButtons = createNavigationButtons(
      container,
      targetMonth,
      targetYear
    );
    container.appendChild(navigationButtons);
  } catch (error) {
    console.error(
      "Erreur lors de la récupération des données du calendrier :",
      error
    );
  }
}

function createNavigationButtons(
  container: HTMLElement,
  targetMonth: number,
  targetYear: number
): HTMLDivElement {
  const navigationButtons = document.createElement("div");
  const previousButton = document.createElement("button");
  previousButton.textContent = "Mois précédent";
  previousButton.addEventListener("click", async () => {
    const newDate = new Date(targetYear, targetMonth - 1, 1);
    await showCalendar(container, newDate.getMonth(), newDate.getFullYear());
  });

  const nextButton = document.createElement("button");
  nextButton.textContent = "Mois suivant";
  nextButton.addEventListener("click", async () => {
    const newDate = new Date(targetYear, targetMonth + 1, 1);
    await showCalendar(container, newDate.getMonth(), newDate.getFullYear());
  });

  navigationButtons.appendChild(previousButton);
  navigationButtons.appendChild(nextButton);

  return navigationButtons;
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

  // Ajuste le numéro du mois pour qu'il soit dans la plage de 0 à 11
  const adjustedMonthNumber = (monthNumber + 12) % 12;

  return months[adjustedMonthNumber];
}
