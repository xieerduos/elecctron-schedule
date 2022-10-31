const os = require("os");
const path = require("path");

const fs = require("fs");
const homedir = os.homedir();

// 拼接路径
let localLogFile = path.join(
  homedir,
  "\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Local Storage\\leveldb"
);

module.exports = async function readLocalFilePaths() {
  try {
    // fix 解决空格问题
    localLogFile = localLogFile.replace("/\\/", "\\\\\\");

    // 获取到所有的文件
    const fileNames = await readfileDir(localLogFile);

    // 过滤只要 .log文件
    let logFileNames = filterLogFile(fileNames, ".log");

    return logFileNames.map((item) => path.join(localLogFile, item));
  } catch (error) {
    console.error(error);
  }
};

// 读取当前目录下所有的文件名
// 读取文件夹，异步的方式
function readfileDir(filePath) {
  return new Promise((resolve, reject) => {
    fs.readdir(filePath, { cwd: filePath }, (error, fileNames) => {
      if (error) {
        return reject(error);
      }
      resolve(fileNames);
    });
  });
}

// 只要.log的
function filterLogFile(fileNames, extname = ".log") {
  // 文件扩展名
  return fileNames.filter((fileName) => path.extname(fileName) === extname);
}
