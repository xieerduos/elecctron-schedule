/**
 * The preload script runs before. It has access to web APIs
 * as well as Electron's renderer process modules and some
 * polyfilled Node.js functions.
 *
 * https://www.electronjs.org/docs/latest/tutorial/sandbox
 */

const {contextBridge, ipcRenderer} = require('electron');

let onArrEvents = [];

// data: {type: '' ,data: }
ipcRenderer.on('main-window', (event, data) => {
    console.log('[on main-window data :>> ]', data);
    if (data && typeof data === 'object' && data.type) {
        const items = onArrEvents.filter((item) => item.type === data.type);
        items.forEach((item) => {
            if (item && item.callback && typeof item.callback === 'function') {
                item.callback(data.data);
            } else {
                console.error('[item error :>> ]', error);
            }
        });
    } else {
        console.error('[on main-window error :>> ]', error);
    }
});

contextBridge.exposeInMainWorld('mainWindow', {
    onLoaded(data) {
        return ipcRenderer.invoke('main-window', data);
    },
    on: (type, callback) => {
        onArrEvents.push({type, callback});
    },
    remove: (type, callback) => {
        if (type && typeof callback === 'function') {
            // remove current callback
            console.log('remove current callback successfully', [type, callback]);
            onArrEvents = onArrEvents.filter(
                (item) => !(item.type === type && item.callback == callback)
            );
        } else if (type && typeof callback !== 'function') {
            console.log('remove all successfully', [type, callback]);
            // remove all
            onArrEvents = onArrEvents.filter((item) => !(item.type === type));
        } else {
            console.error('[remove error]', [type, callback]);
        }
    }
});

process.on('uncaughtException', function (error) {
    console.error('Caught exception:>> ', error);
});
