const chokidar = require("chokidar");
const path = require("path");
const { debounce } = require("lodash");
const { spritesmithRun, getPaths, writrFile } = require("./utils");
const templater = require("spritesheet-templates");

class PlutoSprityPlugin {
  constructor(options) {
    this._options = options;
    if (!this._options.target) {
      this._options.target = {};
    }
    this._options.target.css =
      this._options.target.css || "assets/css/sprite.css";
    this._options.target.img =
      this._options.target.img || "assets/img/sprite.png";
  }

  getWatcher(cb) {
    this._watcher = chokidar.watch(this._options.glob, {
      cwd: this._options.cwd,
      ignoreInitial: true,
      ...this._options.options,
    });

    this._watcher.on("all", (event, path) => {
      console.log("event, path: ", event, path);
      typeof cb === "function" && cb();
    });
  }

  apply(compiler) {
    compiler.hooks.run.tap("pluto-sprity-webpack-plugin", (compiler) => {
      console.log("触发run");

      this.generateSprite();
    });

    compiler.hooks.watchRun.tap("pluto-sprity-webpack-plugin", (compiler) => {
      console.log("触发watchRun");

      this.getWatcher(
        // 为了降低IO操作
        debounce(() => {
          this.generateSprite();
        }, 1000)
      );

      this.generateSprite();
    });
  }

  async generateSprite() {
    const paths = await getPaths(this._options.glob, this._options.cwd);
    const sourcePaths = paths.map((v) => path.resolve(this._options.cwd, v));

    const spritesRes = await spritesmithRun(sourcePaths);

    // 获取绝对路径
    const imgPath = path.resolve(this._options.cwd, this._options.target.img);
    const cssPath = path.resolve(this._options.cwd, this._options.target.css);

    // 相对路径
    const cssToImg = path.normalize(
      path.relative(path.dirname(cssPath), imgPath)
    );

    if (spritesRes.image) {
      await writrFile(imgPath, spritesRes.image);
    }

    const spritesheetObj = Object.entries(spritesRes.coordinates).reduce(
      (v, t) => {
        v.push({
          name: path.parse(t[0]).name,
          ...t[1],
        });
        return v;
      },
      []
    );

    console.log("文件相对路径", cssToImg);

    const templaterRes = templater(
      {
        sprites: spritesheetObj,
        spritesheet: {
          ...spritesRes.properties,
          image: cssToImg, // css文件中读取精灵图的路径
        },
      },
      { format: "css" }
    );

    await writrFile(cssPath, templaterRes);
  }
}

module.exports = PlutoSprityPlugin;
