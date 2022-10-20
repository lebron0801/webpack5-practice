const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const { WebpackManifestPlugin } = require("webpack-manifest-plugin");

module.exports = {
  // 默认值为web，可省略，此有很多枚举值，每个 target 都包含各种 deployment（部署）/environment（环境）特定的附加项，以满足其需求
  target: "web",
  // 环境，生产环境会压缩代码，default: 'production'
  mode: "development",
  // entry: ["./src/index.js", "./src/secondIndex.js"],
  // devtool: "source-map",
  entry: {
    app: {
      import: "./src/index.js",
      // dependOn: "lodash",
    },
    // adminApp: {
    //   import: "./src/secondIndex.js",
    //   // dependOn: "lodash",
    // },
    // lodash: "lodash",
  },
  output: {
    /**
     * 输出文件的名称，[name] 为entry对象中的key name
     * 用于 initial chunk 文件
     */
    filename: "[name].[contenthash].bundle.js",
    // 用于 non-initial chunk 文件，一般为动态加载或者分割包，如果没有配置，将启用filename的配置
    // chunkFilename: "[name].[contenthash].bundle.js",
    // 输出位置的绝对路径
    path: path.resolve(__dirname, "dist"),
    // 是否先清理再输出
    clean: true,
    // 配置将库暴露的方式，此方式在未来可能被抛弃，请使用新的方式配置
    // libraryTarget: "amd",
    // 此处为新的方式配置
    library: {
      type: "amd",
    },
  },
  externalsType: "script",
  // 外部扩展模块，此时打包时，将指定模块放弃掉，此方式无需在html中使用script引用，将会在运行时，异步加载
  externals: {
    jQuery: [
      "https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.js",
      "jQuery",
    ],
    lodash: [
      "https://cdn.bootcdn.net/ajax/libs/lodash.js/4.17.21/lodash.js",
      "_",
    ],
  },
  devServer: {
    // 静态文件所在位置
    static: "./dist",
    // 端口号
    port: 8080,
    host: "localhost",
    // 自动打开浏览器
    open: true,
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      title: "用户列表",
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
    }),
    // new WebpackManifestPlugin(),
    // 开启依赖分析服务
    // new BundleAnalyzerPlugin(),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  resolve: {
    // 设置模块路径别名
    alias: {
      components: path.resolve(__dirname, "src/components/"),
    },
    // 解析时支持的扩展名，此方便在导入模块时，无需对文件添加后缀，"..."表示集成默认值-> [".js", ".json", ".wasm"]
    extensions: [".ts", "..."],
    // 此处为了解决在导入文件夹时，默认取文件夹下的默认文件名，再经过extensions来resolve具体的文件
    mainFiles: ["index"],
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "less-loader",
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.ts$/,
        use: "ts-loader",
      },
    ],
  },
};
