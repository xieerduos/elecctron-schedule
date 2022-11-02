// Modules to control application life and create native browser window
const {
  app,
  powerMonitor,
  screen,
  BrowserWindow,
  ipcMain,
} = require("electron");
const path = require("path");
// const {useWorkingTime} = require('./WorkingTime');
let mainWindow = null;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("index.html");

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // createWindow();

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
  ipcMain.handle("main-window", (event, data) => {
    console.log("data :>> ", data);

    setTimeout(() => {
      showDialog();
    }, 3000);
  });

  function createTransparentWindow() {
    const maxHeight = Math.max(
      ...screen.getAllDisplays().map((item) => item.size.height)
    );
    const hitDisplay = screen
      .getAllDisplays()
      .find((item) => item.size.height === maxHeight);
    // 9 / 16 = w / h = w / maxHeight
    // 9 / 16 =w /h
    const maxWidth = maxHeight * (9 / 16);
    console.log("maxWidth", maxWidth);
    console.log("maxHeight", maxHeight);

    // Create the browser window.
    const mainWindow = new BrowserWindow({
      x: hitDisplay.bounds.x + hitDisplay.size.width - maxWidth,
      y: hitDisplay.bounds.y,
      width: maxWidth,
      height: maxHeight,
      frame: false,
      transparent: true,
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
      },
    });

    // mainWindow.setIgnoreMouseEvents(true);

    mainWindow.setAlwaysOnTop(true, "normal");

    // and load the index-transparent.html of the app.
    mainWindow.loadFile("index-transparent.html");
  }

  createTransparentWindow();

  // useWorkingTime(mainWindow);
});

function showDialog() {
  mainWindow.webContents.send("main-window", {
    type: "show-dialog",
    data: true,
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
