// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

import { IEvent } from "../interfaces/event";

// Preload (Isolated World)
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
  getEvents: async () => {
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
  getFirstDayOfMonth: async (month, year) => {
    try {
      return await ipcRenderer.invoke("get-first-day-of-month", month, year);
    } catch (error) {
      console.error("Error invoking get-first-day-of-month:", error);
      throw error;
    }
  },
  getLastDayOfMonth: async (month, year) => {
    try {
      return await ipcRenderer.invoke("get-last-day-of-month", month, year);
    } catch (error) {
      console.error("Error invoking get-last-day-of-month:", error);
      throw error;
    }
  },
});
