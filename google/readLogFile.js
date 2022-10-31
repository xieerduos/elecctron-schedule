const fs = require("fs");

// 获取文件信息
function getStatByFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(stats);
    });
  });
}
function readTxtFile(filePath, options, callback) {
  // 创建一个读取流
  const readStream = fs.createReadStream(filePath, {
    start: options.start,
    end: options.end,
    highWaterMark: options.highWaterMark,
    encoding: options.encoding,
  });

  // 默认每次读取 64 * 1024 KB
  // 获取读取的次数
  readStream.on("error", (err) => {
    callback({ type: "error", err });
  });
  readStream.on("data", (data) => {
    callback({ type: "data", data: data });
  });
  readStream.on("end", (data) => {
    callback({ type: "end", data: data });
  });
}

function getData(filePath, options) {
  return new Promise((resolve, reject) => {
    let chunks = "";
    readTxtFile(filePath, options, function ({ type, data }) {
      if (type === "data") {
        chunks += data;
      }
      if (type === "end") {
        resolve(chunks);
      }
    });
  });
}

async function handler({ filePath, start, end, perSize, counter = 0 }) {
  let quit = false;

  if (counter >= 32) {
    // 如果连续出现32个� 强制退出
    // 并且往回退16个字节
    // 继续下一次迭代
    // 解决用户恶意输入�文件，导致整个matrx崩溃
    quit = true;
    end = end - 16;
  }
  counter++;

  const options = {
    start,
    end,
    highWaterMark: perSize + 1,
    encoding: "utf8",
  };
  const data = await getData(filePath, options);

  // 如果有报错将会显示这个
  if (!quit && data.slice(-1) === "�") {
    return handler({
      filePath: filePath,
      start,
      end: end + 1,
      perSize,
      counter,
    });
  }
  return { filePath, start, end, data, quit };
}

// 分段读取文件
async function readFileSegments(
  { fileInfo, filePath, perSize, start, end },
  caches = []
) {
  end = end >= fileInfo.size ? fileInfo.size : end;

  const result = await handler({ filePath, start, end, perSize });

  start = result.end + 1;
  end = start + perSize;

  caches.push(result);

  if (result.end >= fileInfo.size) {
    // 读取完成
    return caches;
  } else {
    return readFileSegments(
      { fileInfo, filePath, perSize, start, end },
      caches
    );
  }
}

// let perSize = 1024 * 1024 * 5;
// let start = 0;
// let end = perSize;

module.exports = function readLogFile({ filePath, perSize, start, end }) {
  return new Promise((resolve, reject) => {
    getStatByFile(filePath)
      .then((fileInfo) => {
        readFileSegments({ fileInfo, filePath, perSize, start, end }).then(
          (result) => {
            // const sucessData = result.map((item) => item.data).join("");

            resolve(result);
          }
        );
      })
      .catch(reject);
  });
};
