import { IEvent } from "../interfaces/event";

const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electron", {
  getAll: async () => {
    try {
      return await ipcRenderer.invoke("get-events");
    } catch (error) {
      console.error("Error invoking get-events:", error);
      throw error;
    }
  },
  onUpdateEvent: (cb: (e: any, event: any) => void) => {
    ipcRenderer.on("event-update-event-window", (e: any, event: any) => {
      cb(e, event)
    })
  },
  onUpdateImport: (cb: (e: any, event: any) => void) => {
    ipcRenderer.on("import-window", (e: any, event: any) => {
      cb(e, event)
    })
  },
  getCurrentMonth: async () => {
    try {
      return await ipcRenderer.invoke("get-current-month");
    } catch (error) {
      console.error("Error invoking get-current-month:", error);
      throw error;
    }
  },

  getCurrentYear: async () => {
    try {
      return await ipcRenderer.invoke("get-current-year");
    } catch (error) {
      console.error("Error invoking get-current-year:", error);
      throw error;
    }
  },

  getFirstDayOfMonth: async (month: number, year: number) => {
    try {
      return await ipcRenderer.invoke("get-first-day-of-month", month, year);
    } catch (error) {
      console.error("Error invoking get-first-day-of-month:", error);
      throw error;
    }
  },

  getLastDayOfMonth: async (month: number, year: number) => {
    try {
      return await ipcRenderer.invoke("get-last-day-of-month", month, year);
    } catch (error) {
      console.error("Error invoking get-last-day-of-month:", error);
      throw error;
    }
  },

  createEvent: async (event: IEvent) => {
    try {
      return await ipcRenderer.invoke("create-event", event);
    } catch (error) {
      console.error("Error invoking create-event:", error);
      throw error;
    }
  },

  getEventById: async (eventId: number) => {
    try {
      return await ipcRenderer.invoke("get-event-by-id", eventId);
    } catch (error) {
      console.error("Error invoking get-event-by-id:", error);
      throw error;
    }
  },

  updateEvent: async (eventId: number, updatedEvent: IEvent) => {
    try {
      return await ipcRenderer.invoke("update-event", eventId, updatedEvent);
    } catch (error) {
      console.error("Error invoking update-event:", error);
      throw error;
    }
  },

  deleteEvent: async (eventId: number) => {
    try {
      return await ipcRenderer.invoke("delete-event", eventId);
    } catch (error) {
      console.error("Error invoking delete-event:", error);
      throw error;
    }
  },
  closeWindow: () => {
    try {
      ipcRenderer.send("close-event-window");
    } catch (error) {
      console.error("Error invoking close-event-window:", error);
      throw error;
    }
  },
  closeUpdateWindow: () => {
    try {
      ipcRenderer.send("close-update-event-window");
    } catch (error) {
      console.error("Error invoking close-update-event-window:", error);
      throw error;
    }
  },
  closeImportWindow: () => {
    try {
      ipcRenderer.send("close-import-window");
    } catch (error) {
      console.error("Error invoking close-event-window:", error);
      throw error;
    }
  },
  reloadWindow: () => {
    try {
      ipcRenderer.send("reload-window");
    } catch (err) {
      console.error("Error invoking reload-window", err);
      throw err;
    }
  },
  reloadUpdateWindow: (eventId: number) => {
    try {
      ipcRenderer.send("reload-update-event-window", eventId);
    } catch (err) {
      console.error("Error send reload-update-event-window", err);
      throw err;
    }
  },
  createUpdateWindowEvent: async (eventId: number) => {
    try {
      ipcRenderer.invoke("open-update-event-window", eventId);
      return true;
    } catch (error) {
      console.error("Error invoking open-update-event-window", error);
      throw error;
    }
  },
  createImportWindow: async (event: IEvent) => {
    try {
      ipcRenderer.invoke("open-import-window", event);
      return true;
    } catch (error) {
      console.error("Error invoking open-update-event-window", error);
      throw error;
    }
  },
});
