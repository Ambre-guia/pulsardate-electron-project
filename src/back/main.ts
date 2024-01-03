import { app, ipcMain, BrowserWindow, Menu } from "electron";
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

// Handle to get all events
ipcMain.handle("get-events", async (event) => await getAll());

// Handle to create a new event
ipcMain.handle("create-event", async (event, newEvent) => {
  try {
    return await createEvent(newEvent);
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
});

// Handle to get an event by ID
ipcMain.handle("get-event-by-id", async (event, eventId) => {
  try {
    return await getEventById(eventId);
  } catch (error) {
    console.error("Error getting event by ID:", error);
    throw error;
  }
});

// Handle to update an existing event
ipcMain.handle("update-event", async (event, eventId, updatedEvent) => {
  try {
    return await updateEvent(eventId, updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
});

// Handle to delete an event by ID
ipcMain.handle("delete-event", async (event, eventId) => {
  try {
    return await deleteEvent(eventId);
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
});

// Handle to get the current month
ipcMain.handle("get-current-month", async (event) => getCurrentMonth());

// Handle to get the current year
ipcMain.handle("get-current-year", async (event) => getCurrentYear());

// Handle to get the first day of the month
ipcMain.handle("get-first-day-of-month", async (event, month, year) =>
  getFirstDayOfMonth(month, year)
);

// Handle to get the last day of the month
ipcMain.handle("get-last-day-of-month", async (event, month, year) =>
  getLastDayOfMonth(month, year)
);

ipcMain.handle("open-event-window", () => createWindowEvent());

ipcMain.handle("open-update-event-window", (event, eventId) => {
  try {
    console.log("asrzae", eventId);
    
    createUpdateWindowEvent(eventId);
    return true;
  } catch (error) {
    console.error("Error opening update event window:", error);
    return false;
  }
});
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "./preload.js"),
    },
    width: 1000,
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../../index.html"));

  ipcMain.on('reload-window', () => {
    mainWindow.reload();
  });
  // Open the DevTools.
  mainWindow.webContents.openDevTools();
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
  eventWindow.webContents.openDevTools();

  // Gère le message pour fermer la fenêtre de l'événement
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

  // Charge le fichier event.html
  updateEventWindow.loadFile(path.join(__dirname, "../../update-event.html"));

  // Ouvre les DevTools (facultatif)
  updateEventWindow.webContents.openDevTools();

  const reloadHandler = (event: Electron.IpcMainEvent, eventId: number) => {
    updateEventWindow.reload();
    getEventById(eventId).then((event) => {
      setTimeout(() => {
        updateEventWindow.webContents.send("event-update-event-window", event);
      }, 200);
    });
  };

  // Gère le message pour recharger la page avec l'eventId
  ipcMain.on("reload-update-event-window", reloadHandler);

  getEventById(eventId).then((event) => {
    setTimeout(() => {
      updateEventWindow.webContents.send("event-update-event-window", event);
    }, 200);
  });

  // Gère le message pour fermer la fenêtre de mise à jour de l'événement
  ipcMain.once('close-update-event-window', () => {
    ipcMain.removeListener("reload-update-event-window", reloadHandler);
    updateEventWindow.close();
  });

  return updateEventWindow;
}

// Générer un menu pour l'application
const menuTemplate = [
  {
    label: "Event",
    submenu: [
      {
        label: "Creer un event",
        click: () => {
          createWindowEvent();
        },
      },
    ],
  },
];

// Créer le menu à partir du modèle
const menu = Menu.buildFromTemplate(menuTemplate);

// Définir le menu de l'application
Menu.setApplicationMenu(menu);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
