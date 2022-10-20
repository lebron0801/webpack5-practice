const path = require("path");
const PlutoSprityPlugin = require("../sprite-webpack-plugin/index");
const ConsoleLogOnBuildWebpackPlugin = require("../console-log-on-build-webpack-plugin");

/**
 * 1.人才去嘉兴带
 * 2.重点培养人员
 * 3.实习生上手一个月期限设置
 */
module.exports = (env, argv) => {
  return {
    mode: "development",
    entry: {
      main: path.resolve(__dirname, "./index.js"),
    },
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "./dist"),
      library: {
        type: "amd",
      },
    },
    plugins: [
      new PlutoSprityPlugin({
        glob: "assets/img/sprite/*.png",
        cwd: path.resolve(__dirname, "src"),
      }),
      new ConsoleLogOnBuildWebpackPlugin(),
    ],
  };
};
