import { IEvent } from "../../../interfaces/event.js";
import { closeUpdateEventForm } from "./closeUpdateEventForm.js";
import { updateEventForm } from "../event/updateEvent.js";

let isFormOpen = false;
let currentUpdateEventModal: any;

export function toggleUpdateEventForm(event: IEvent) {
    if (!isFormOpen) {
        currentUpdateEventModal = updateEventForm(event);
        isFormOpen = true;
    } else {
        closeUpdateEventForm(currentUpdateEventModal);
        isFormOpen = false;
    }

    const editButton = document.querySelector(".show-event-container button");
    if (editButton) {
        editButton.textContent = isFormOpen ? "Cancel" : "Edit Event";
    }
}