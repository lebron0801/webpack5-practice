const Spritesmith = require("spritesmith");
const glob = require("glob");
const mkdirp = require("mkdirp");
const path = require("path");
const fs = require("fs");

/**
 * @name 合成图片
 * @description 将小图合并成大图
 * @param {array} src - 小图的绝对路径组成的数组
 * @returns {Object} result - 合成后的对象
 * @returns {Object} result.coordinates - 小图的路径和宽高对象数据
 * @returns {Object} result.properties - 大图的宽高
 * @returns {Object} result.image - 大图的二进制信息
 */
const spritesmithRun = (src) => {
  return new Promise((resolve, reject) => {
    Spritesmith.run({ src }, function handleResult(err, result) {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * @name 获取文件路径
 * @param {string} globPath 文件目录
 * @param {string} cwd 文件根目录
 * @returns {string[]} 文件路径列表
 */
const getPaths = (globPath, cwd) => {
  return new Promise((resolve, reject) => {
    glob(
      globPath,
      {
        cwd,
      },
      function (err, files) {
        if (err) {
          reject(err);
        } else {
          resolve(files);
        }
      }
    );
  });
};

/**
 * @name 将图片写入文件
 * @param {string} dir 绝对路径
 * @param {Buffer} image 二进制文件
 * @returns {Promise}
 */
const writrFile = (dir, image) => {
  return new Promise((resolve, reject) => {
    mkdirp.sync(path.dirname(dir));

    fs.writeFile(dir, image, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

module.exports = {
  spritesmithRun,
  getPaths,
  writrFile,
};
