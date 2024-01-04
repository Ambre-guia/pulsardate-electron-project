"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleImportedICS = void 0;
const electron_1 = require("electron");
const path = require("path");
const event_js_1 = require("./bdd/event.js");
const date_js_1 = require("./inc/date.js");
const ICAL = require("ical.js");
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
electron_1.ipcMain.handle("open-update-event-window", (event, eventId) => {
    try {
        createUpdateWindowEvent(eventId);
        return true;
    }
    catch (error) {
        console.error("Error opening update event window:", error);
        return false;
    }
});
electron_1.ipcMain.handle("open-import-window", (event, events) => {
    try {
        createImportWindow(events);
        return true;
    }
    catch (error) {
        console.error("Error opening update event window:", error);
        return false;
    }
});
function createWindow() {
    // Create the browser window.
    const mainWindow = new electron_1.BrowserWindow({
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
        width: 1000,
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
    electron_1.ipcMain.on('close-event-window', () => {
        eventWindow.destroy();
    });
    return eventWindow;
}
function createUpdateWindowEvent(eventId) {
    const updateEventWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 1000,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
    });
    // Define the reload handler function
    const reloadHandler = (event, eventId) => {
        if (!updateEventWindow.isDestroyed()) {
            updateEventWindow.reload();
        }
    };
    // Charge le fichier event.html
    updateEventWindow.loadFile(path.join(__dirname, "../../update-event.html"));
    // Ouvre les DevTools (facultatif)
    updateEventWindow.webContents.openDevTools();
    // Gère le message pour recharger la page avec l'eventId
    electron_1.ipcMain.on("reload-update-event-window", reloadHandler);
    // Gère le message pour fermer la fenêtre de mise à jour de l'événement
    electron_1.ipcMain.on('close-update-event-window', () => {
        electron_1.ipcMain.removeListener("reload-update-event-window", reloadHandler);
        if (!updateEventWindow.isDestroyed()) {
            updateEventWindow.close();
        }
    });
    // Attach the "dom-ready" event listener
    updateEventWindow.webContents.on("dom-ready", () => {
        // Once the DOM is ready, get the event by ID and send it to the renderer process
        (0, event_js_1.getEventById)(eventId).then((event) => {
            if (!updateEventWindow.isDestroyed()) {
                updateEventWindow.webContents.send("event-update-event-window", event);
            }
        });
    });
    return updateEventWindow;
}
function createImportWindow(event) {
    // Create the event window.
    const importWindow = new electron_1.BrowserWindow({
        height: 800,
        width: 1000,
        webPreferences: {
            preload: path.join(__dirname, "./preload.js"),
        },
    });
    // Load the event.html file.
    importWindow.loadFile(path.join(__dirname, "../../import.html"));
    // Open the DevTools (optional).
    importWindow.webContents.openDevTools();
    importWindow.webContents.on("dom-ready", () => {
        importWindow.webContents.send("import-window", event);
    });
    // Gère le message pour fermer la fenêtre de l'événement
    electron_1.ipcMain.on('close-import-window', () => {
        importWindow.destroy();
    });
    return importWindow;
}
function showImportDialog() {
    const { dialog } = require('electron');
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
async function handleImportedICS(filePath) {
    const fs = require("fs").promises;
    try {
        const icsContent = await fs.readFile(filePath, "utf-8");
        const jcalData = ICAL.parse(icsContent);
        const comp = new ICAL.Component(jcalData);
        const importedEvent = extractEventFromComponent(comp);
        createImportWindow(importedEvent);
    }
    catch (error) {
        console.error("Error handling imported ICS file:", error);
        throw error;
    }
}
exports.handleImportedICS = handleImportedICS;
function extractEventFromComponent(component) {
    const jCal = component.jCal;
    if (!jCal || jCal.length < 3) {
        console.error("Invalid jCal structure in the component");
        return null;
    }
    const vcalendar = jCal[2];
    const vevent = vcalendar.find((item) => item[0] === "vevent");
    if (!vevent) {
        console.error("Invalid vevent structure in the vcalendar component");
        return null;
    }
    const event = {
        id: vevent[1].find((item) => item[0] === "uid")?.[3] || "",
        date_deb: new Date(vevent[1].find((item) => item[0] === "dtstart")?.[3] || ""),
        date_fin: new Date(vevent[1].find((item) => item[0] === "dtend")?.[3] || ""),
        titre: vevent[1].find((item) => item[0] === "summary")?.[3] || "",
        location: vevent[1].find((item) => item[0] === "location")?.[3] || "",
        categorie: vevent[1].find((item) => item[0] === "categories")?.[3] || "",
        statut: vevent[1].find((item) => item[0] === "status")?.[3] || "",
        description: vevent[1].find((item) => item[0] === "description")?.[3] || "",
        transparence: vevent[1].find((item) => item[0] === "transp")?.[3] || "",
        nbMaj: 1,
    };
    return event;
}
// Générer un menu pour l'application
const menuTemplate = [
    {
        label: "Menu",
        submenu: [
            {
                label: "Creer un event",
                click: () => {
                    createWindowEvent();
                },
            },
            {
                label: "Importer un fichier ICS",
                click: () => {
                    showImportDialog();
                },
            },
        ],
    },
];
const menu = electron_1.Menu.buildFromTemplate(menuTemplate);
electron_1.Menu.setApplicationMenu(menu);
electron_1.app.whenReady().then(() => {
    createWindow();
    electron_1.app.on("activate", function () {
        if (electron_1.BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
//# sourceMappingURL=main.js.map