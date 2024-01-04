import { IEvent } from "../../../interfaces/event.js";
import { formatDateForICS } from "../date/formatDateForICS.js";

export function generateICS(event: IEvent) {
  const icsLines = [];

  // Begin the iCalendar file
  icsLines.push('BEGIN:VCALENDAR');
  icsLines.push('VERSION:2.0');
  icsLines.push('PRODID:-//PULSARDATE-ELECTRON-PROJECT//EN');

  // Begin the event entry
  icsLines.push('BEGIN:VEVENT');
  icsLines.push(`SUMMARY:${event.titre}`);
  icsLines.push(`DESCRIPTION:${event.description}`);
  icsLines.push(`LOCATION:${event.location}`);
  icsLines.push(`DTSTART:${formatDateForICS(event.date_deb)}`);
  icsLines.push(`DTEND:${formatDateForICS(event.date_fin)}`);
  icsLines.push(`CATEGORIES:${event.categorie}`);
  icsLines.push(`STATUS:${event.statut}`);
  icsLines.push(`TRANSP:${event.transparence}`);

  // End the event entry
  icsLines.push('END:VEVENT');

  // End the iCalendar file
  icsLines.push('END:VCALENDAR');

  // Combine lines with line breaks
  const icsContent = icsLines.join('\r\n');

  return icsContent;
}
