const { app, Menu, BrowserWindow } = require("electron");
const { autoUpdater } = require("electron-updater");
const logger = require("electron-log");
const path = require("path");

autoUpdater.logger = logger;

async function createWindow() {
  Menu.setApplicationMenu(null);

  // Create the browser window.
  mainWindow = new BrowserWindow({
    show: false,
    webPreferences: {
      devTools: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      worldSafeExecuteJavaScript: true,
      contextIsolation: false
    }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}//index.html`);

  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on("did-finish-load", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on("close", async (e) => {});

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  console.log("Checking for updates...");
  autoUpdater.checkForUpdatesAndNotify();

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  await createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  // if (process.platform !== "darwin") {
  app.quit();
  // }
});

app.on("activate", async () => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow) {
    mainWindow.restore();
  } else {
    // Something went wrong
    app.quit();
  }
});
