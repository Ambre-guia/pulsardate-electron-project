// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { IEvent } from "../interfaces/event";

// Preload (Isolated World)
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
  reloadWindow: () => {
    try{
      ipcRenderer.send("reload-window");
    } catch(err){
      console.error("Error invoking reload-windo", err);
      throw err;
    }
  }
});
