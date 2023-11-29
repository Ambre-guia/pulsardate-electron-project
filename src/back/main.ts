import { app, ipcMain, BrowserWindow } from "electron";
import * as path from "path";
import { getAll } from "./bdd/event.js";
import {
  getCurrentMonth,
  getCurrentYear,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "./inc/date.js";

//Zone de handle
ipcMain.handle("get-events", async (event) => await getAll());
ipcMain.handle("get-current-month", async (event) => getCurrentMonth());
ipcMain.handle("get-current-year", async (event) => getCurrentYear());
ipcMain.handle("get-first-day-of-month", async (event, month, year) =>
  getFirstDayOfMonth(month, year)
);
ipcMain.handle("get-last-day-of-month", async (event, month, year) =>
  getLastDayOfMonth(month, year)
);

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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
