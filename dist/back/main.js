"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const event_js_1 = require("./bdd/event.js");
const date_js_1 = require("./inc/date.js");
//Zone de handle
electron_1.ipcMain.handle("get-events", async (event) => await (0, event_js_1.getAll)());
electron_1.ipcMain.handle("get-current-month", async (event) => (0, date_js_1.getCurrentMonth)());
electron_1.ipcMain.handle("get-current-year", async (event) => (0, date_js_1.getCurrentYear)());
electron_1.ipcMain.handle("get-first-day-of-month", async (event, month, year) => (0, date_js_1.getFirstDayOfMonth)(month, year));
electron_1.ipcMain.handle("get-last-day-of-month", async (event, month, year) => (0, date_js_1.getLastDayOfMonth)(month, year));
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
    // Open the DevTools.
    mainWindow.webContents.openDevTools();
}
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