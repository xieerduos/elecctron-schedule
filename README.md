# electron-schedule

[Windows 关机、锁屏、休眠和快捷命令](https://cloud.tencent.com/developer/article/1648498)

### 锁屏

新建锁屏.txt 文件，填写下面内容 -> 保存 ,重命名锁屏.vbs

```vb
Dim WSHShell

Set WSHShell=WScript.CreateObject("WScript.Shell")

WSHShell.Run "Rundll32.exe user32.dll,LockWorkStation", 0
```

### 休眠

新建休眠.txt 文件，填写下面内容 -> 保存 ,重命名休眠.bat

```s
shutdown.exe -h
```

### 关机

新建关机.txt 文件，填写下面内容 -> 保存 ,重命名关机.bat ,60 秒后关机

```s
shutdown -s -t 60
```

## electron-quick-start

**Clone and run for a quick way to see Electron in action.**

This is a minimal Electron application based on the [Quick Start Guide](https://electronjs.org/docs/latest/tutorial/quick-start) within the Electron documentation.

A basic Electron application needs just these files:

-   `package.json` - Points to the app's main file and lists its details and dependencies.
-   `main.js` - Starts the app and creates a browser window to render HTML. This is the app's **main process**.
-   `index.html` - A web page to render. This is the app's **renderer process**.
-   `preload.js` - A content script that runs before the renderer process loads.

You can learn more about each of these components in depth within the [Tutorial](https://electronjs.org/docs/latest/tutorial/tutorial-prerequisites).

## To Use

To clone and run this repository you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
git clone https://github.com/electron/electron-quick-start
# Go into the repository
cd electron-quick-start
# Install dependencies
npm install
# Run the app
npm start
```

Note: If you're using Linux Bash for Windows, [see this guide](https://www.howtogeek.com/261575/how-to-run-graphical-linux-desktop-applications-from-windows-10s-bash-shell/) or use `node` from the command prompt.

## Resources for Learning Electron

-   [electronjs.org/docs](https://electronjs.org/docs) - all of Electron's documentation
-   [Electron Fiddle](https://electronjs.org/fiddle) - Electron Fiddle, an app to test small Electron experiments

## License

[CC0 1.0 (Public Domain)](LICENSE.md)
