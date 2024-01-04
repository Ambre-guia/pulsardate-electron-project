export function formatDateForICS(date: Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    // Return the formatted date string in the ICS format: YYYYMMDDTHHMMSSZ
    return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}
