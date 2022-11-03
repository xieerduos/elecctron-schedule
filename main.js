// Modules to control application life and create native browser window
const {app, screen, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
let windwos = [];

function createTransparentWindow() {
    screen.getAllDisplays().forEach((display) => {
        // console.log('display :>> ', display);
        // Create the browser window.
        const mainWindow = new BrowserWindow({
            x: display.bounds.x,
            y: display.bounds.y,
            width: display.bounds.width,
            height: display.bounds.height,
            transparent: true,
            frame: false,
            fullscreen: false,
            show: false,
            skipTaskbar: true,
            webPreferences: {
                preload: path.join(__dirname, 'preload.js')
            }
        });

        mainWindow.on('closed', () => {
            app.quit();
        });

        // and load the index.html of the app.
        mainWindow.loadFile('hacker.html');

        windwos.push(mainWindow);
        mainWindow.setAlwaysOnTop(true, 'screen-saver');
        mainWindow.on('ready-to-show', () => {
            mainWindow.show();

            setTimeout(() => {
                mainWindow.setFullScreen(true);

                mainWindow.blur();
                setTimeout(() => {
                    mainWindow.focus();
                }, 100);
            }, 100);

            // 下面三行代码别删
            // 不然只能来评论区发送666解锁屏幕
            // setTimeout(() => {
            //     mainWindow.close();
            // }, 10 * 1000);
        });
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createTransparentWindow();

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0)
            createTransparentWindow();
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
