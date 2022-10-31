const readLocalFilePaths = require("./readLocalFilePaths");
const readLogFile = require("./readLogFile");
const dayjs = require("dayjs");

exports.useGoogleLog = async function (mainWindow) {
  try {
    let count = 0;
    // 每个5秒读取一下本地数据
    setInterval(() => {
      count++;
      readLocalData().then((result) => {
        const dateTime = dayjs().format("YYYY/M/D HH:mm:ss");
        console.log(dateTime, count, "read log ok");

        // 发送到渲染进程
        mainWindow.webContents.send("main-window", {
          type: "local-log",
          data: result.map((item) => ({ ...item, dateTime })),
        });
      });
    }, 5 * 1000);
  } catch (err) {
    console.error("[useGoogleLog error]", err);
  }
};
async function readLocalData() {
  try {
    const filePaths = await readLocalFilePaths();
    const filePath = filePaths[0];

    // 读取文件块的大小
    let perSize = 200;
    // 从0开始读取
    let start = 0;
    // 读取结束的字节
    let end = perSize;

    const result = await readLogFile({
      filePath,
      perSize,
      start,
      end,
    });
    return result;
  } catch (error) {
    console.error("[readLocalData error]", error);
    throw error;
  }
}
