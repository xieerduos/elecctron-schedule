// 连续工作时间
const {powerMonitor} = require('electron');
// 已知：
// 当前系统得空闲时间（秒数）

// 1. 空闲时间小于等于30秒，说明一直在工作
// 2. 当空闲时间大于 30 秒，重新计算连续工作时间

const store = {
    startTime: new Date(),
    endTime: new Date(),
    intervalId: null
};

function getSystemIdleTime(params) {
    return powerMonitor.getSystemIdleTime();
}

// 锁定屏幕
function setLockScreen() {
    const spawn = require('child_process').spawnSync;
    const vbs = spawn('cscript.exe', ['./LockScreen.vbs', 'one']);

    console.log(`stderr: ${vbs.stderr.toString()}`);
    console.log(`stdout: ${vbs.stdout.toString()}`);
    console.log(`status: ${vbs.status}`);
}

function resetTime() {
    store.startTime = new Date();
    store.endTime = new Date();
}

function setWorkingTime(mainWindow) {
    const idleSeconds = getSystemIdleTime();
    if (idleSeconds > 60) {
        resetTime();
    } else {
        store.endTime = new Date();
    }
    const workSeconds = (store.endTime - store.startTime) / 1000;
    mainWindow.webContents.send('main-window', {
        type: 'show-dialog',
        value: workSeconds
    });

    console.log('idleSeconds :>> ', idleSeconds);
    // 30秒后自动锁屏
    if (idleSeconds > 30) {
        setLockScreen();
        clearInterval(store.intervalId);
        resetTime();
    }
}

module.exports.useWorkingTime = function useWorkingTime(mainWindow) {
    store.intervalId = setInterval(() => {
        setWorkingTime(mainWindow);
    }, 1000);
};
