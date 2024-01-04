import { app, ipcMain, BrowserWindow, Menu, dialog } from "electron";
import * as path from "path";
import {
  getAll,
  createEvent,
  getEventById,
  updateEvent,
  deleteEvent,
} from "./bdd/event.js";
import {
  getCurrentMonth,
  getCurrentYear,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "./inc/date.js";
import { IEvent } from "../interfaces/event.js";
const ICAL = require("ical.js");

// Event-related handlers
ipcMain.handle("get-events", async (event) => await getAll());

ipcMain.handle("create-event", async (event, newEvent) => {
  try {
    return await createEvent(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
});

ipcMain.handle("get-event-by-id", async (event, eventId) => {
  try {
    return await getEventById(eventId);
  } catch (error) {
    console.error("Error getting event by ID:", error);
    throw error;
  }
});

ipcMain.handle("update-event", async (event, eventId, updatedEvent) => {
  try {
    return await updateEvent(eventId, updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
});

ipcMain.handle("delete-event", async (event, eventId) => {
  try {
    return await deleteEvent(eventId);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
});

// Date-related handlers
ipcMain.handle("get-current-month", async (event) => getCurrentMonth());

ipcMain.handle("get-current-year", async (event) => getCurrentYear());

ipcMain.handle("get-first-day-of-month", async (event, month, year) =>
  getFirstDayOfMonth(month, year)
);

ipcMain.handle("get-last-day-of-month", async (event, month, year) =>
  getLastDayOfMonth(month, year)
);

// Window-related handlers
ipcMain.handle("open-event-window", () => createWindowEvent());

ipcMain.handle("open-update-event-window", (event, eventId) => {
  try {
    createUpdateWindowEvent(eventId);
    return true;
  } catch (error) {
    console.error("Error opening update event window:", error);
    return false;
  }
});

ipcMain.handle("open-import-window", (event, events) => {
  try {
    createImportWindow(events);
    return true;
  } catch (error) {
    console.error("Error opening update event window:", error);
    return false;
  }
});

function createWindow() {
  // Create the main browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
    width: 1000,
  });

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../../index.html"));

  ipcMain.on('reload-window', () => {
    mainWindow.reload();
  });

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
}

function createWindowEvent() {
  // Create the event window.
  const eventWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // Load the event.html file.
  eventWindow.loadFile(path.join(__dirname, "../../event.html"));

  // Open the DevTools (optional).
  // eventWindow.webContents.openDevTools();

  // Handle the message to close the event window.
  ipcMain.on('close-event-window', () => {
    eventWindow.destroy();
  });

  return eventWindow;
}

function createUpdateWindowEvent(eventId: number) {
  const updateEventWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // Define the reload handler function.
  const reloadHandler = (event: Electron.IpcMainEvent, eventId: number) => {
    if (!updateEventWindow.isDestroyed()) {
      updateEventWindow.reload();
    }
  };

  // Load the update-event.html file.
  updateEventWindow.loadFile(path.join(__dirname, "../../update-event.html"));

  // Open the DevTools (optional).
  // updateEventWindow.webContents.openDevTools();

  // Handle the message to reload the page with the eventId.
  ipcMain.on("reload-update-event-window", reloadHandler);

  // Handle the message to close the update event window.
  ipcMain.on('close-update-event-window', () => {
    ipcMain.removeListener("reload-update-event-window", reloadHandler);

    if (!updateEventWindow.isDestroyed()) {
      updateEventWindow.close();
    }
  });

  // Attach the "dom-ready" event listener.
  updateEventWindow.webContents.on("dom-ready", () => {
    // Once the DOM is ready, get the event by ID and send it to the renderer process.
    getEventById(eventId).then((event) => {
      if (!updateEventWindow.isDestroyed()) {
        updateEventWindow.webContents.send("event-update-event-window", event);
      }
    });
  });

  return updateEventWindow;
}

function createImportWindow(event: IEvent) {
  // Create the import window.
  const importWindow = new BrowserWindow({
    height: 800,
    width: 1000,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
  });

  // Load the import.html file.
  importWindow.loadFile(path.join(__dirname, "../../import.html"));

  // Open the DevTools (optional).
  // importWindow.webContents.openDevTools();

  importWindow.webContents.on("dom-ready", () => {
    importWindow.webContents.send("import-window", event);
  });

  // Handle the message to close the import window.
  ipcMain.on('close-import-window', () => {
    importWindow.destroy();
  });

  return importWindow;
}

function showImportDialog() {
  dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'ICS Files', extensions: ['ics'] },
      { name: 'All Files', extensions: ['*'] },
    ],
  }).then((result) => {
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];

      handleImportedICS(filePath);
    }
  }).catch((err) => {
    console.error('Error in showImportDialog:', err);
  });
}

export async function handleImportedICS(filePath: string) {
  const fs = require("fs").promises;

  try {
    const icsContent = await fs.readFile(filePath, "utf-8");

    const jcalData = ICAL.parse(icsContent);
    const comp = new ICAL.Component(jcalData);

    const importedEvent = extractEventFromComponent(comp);

    createImportWindow(importedEvent);

  } catch (error) {
    console.error("Error handling imported ICS file:", error);
    throw error;
  }
}

function extractEventFromComponent(component: any): IEvent | null {
  const jCal = component.jCal;

  if (!jCal || jCal.length < 3) {
    console.error("Invalid jCal structure in the component");
    return null;
  }

  const vcalendar = jCal[2];

  const vevent = vcalendar.find((item: any) => item[0] === "vevent");

  if (!vevent) {
    console.error("Invalid vevent structure in the vcalendar component");
    return null;
  }

  const event: IEvent = {
    id: vevent[1].find((item: any) => item[0] === "uid")?.[3] || "",
    date_deb: new Date(vevent[1].find((item: any) => item[0] === "dtstart")?.[3] || ""),
    date_fin: new Date(vevent[1].find((item: any) => item[0] === "dtend")?.[3] || ""),
    titre: vevent[1].find((item: any) => item[0] === "summary")?.[3] || "",
    location: vevent[1].find((item: any) => item[0] === "location")?.[3] || "",
    categorie: vevent[1].find((item: any) => item[0] === "categories")?.[3] || "",
    statut: vevent[1].find((item: any) => item[0] === "status")?.[3] || "",
    description: vevent[1].find((item: any) => item[0] === "description")?.[3] || "",
    transparence: vevent[1].find((item: any) => item[0] === "transp")?.[3] || "",
    nbMaj: 1,
  };

  return event;
}

// Generate a menu for the application
const menuTemplate = [
  {
    label: "Menu",
    submenu: [
      {
        label: "Create an event",
        click: () => {
          createWindowEvent();
        },
      },
      {
        label: "Import an ICS file",
        click: () => {
          showImportDialog();
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(menuTemplate);

Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
