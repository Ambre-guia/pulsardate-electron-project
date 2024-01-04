// Variable to track the state of the form
let isFormOpen = false;

// Function to close the update event form
export function closeUpdateEventForm(updateEventModal?: HTMLDivElement) {
  // Remove the update event modal from the page
  if (updateEventModal) {
    document.body.removeChild(updateEventModal);
  }
  // Update the form state
  isFormOpen = false;
}
