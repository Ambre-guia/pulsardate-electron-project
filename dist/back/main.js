"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const event_js_1 = require("./bdd/event.js");
const date_js_1 = require("./inc/date.js");
// Handle to get all events
electron_1.ipcMain.handle("get-events", async (event) => await (0, event_js_1.getAll)());
// Handle to create a new event
electron_1.ipcMain.handle("create-event", async (event, newEvent) => {
    try {
        return await (0, event_js_1.createEvent)(newEvent);
    }
    catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
});
// Handle to get an event by ID
electron_1.ipcMain.handle("get-event-by-id", async (event, eventId) => {
    try {
        return await (0, event_js_1.getEventById)(eventId);
    }
    catch (error) {
        console.error("Error getting event by ID:", error);
        throw error;
    }
});
// Handle to update an existing event
electron_1.ipcMain.handle("update-event", async (event, eventId, updatedEvent) => {
    try {
        return await (0, event_js_1.updateEvent)(eventId, updatedEvent);
    }
    catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
});
// Handle to delete an event by ID
electron_1.ipcMain.handle("delete-event", async (event, eventId) => {
    try {
        return await (0, event_js_1.deleteEvent)(eventId);
    }
    catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
});
// Handle to get the current month
electron_1.ipcMain.handle("get-current-month", async (event) => (0, date_js_1.getCurrentMonth)());
// Handle to get the current year
electron_1.ipcMain.handle("get-current-year", async (event) => (0, date_js_1.getCurrentYear)());
// Handle to get the first day of the month
electron_1.ipcMain.handle("get-first-day-of-month", async (event, month, year) => (0, date_js_1.getFirstDayOfMonth)(month, year));
// Handle to get the last day of the month
electron_1.ipcMain.handle("get-last-day-of-month", async (event, month, year) => (0, date_js_1.getLastDayOfMonth)(month, year));
electron_1.ipcMain.handle("open-event-window", () => createWindowEvent());
function createWindow() {
    // Create the browser window.
    const mainWindow = new electron_1.BrowserWindow({
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
        width: 800,
    });
    // and load the index.html of the app.
    mainWindow.loadFile(path.join(__dirname, "../../index.html"));
    electron_1.ipcMain.on('reload-window', () => {
        mainWindow.reload();
    });
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}
function createWindowEvent() {
    // Create the event window.
    const eventWindow = new electron_1.BrowserWindow({
        height: 400,
        width: 600,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
    });
    // Load the event.html file.
    eventWindow.loadFile(path.join(__dirname, "../../event.html"));
    // Open the DevTools (optional).
    eventWindow.webContents.openDevTools();
    // Gère le message pour fermer la fenêtre de l'événement
    electron_1.ipcMain.on('close-event-window', () => {
        eventWindow.close();
    });
    return eventWindow;
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
const menu = electron_1.Menu.buildFromTemplate(menuTemplate);
// Définir le menu de l'application
electron_1.Menu.setApplicationMenu(menu);
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
//# sourceMappingURL=main.js.map