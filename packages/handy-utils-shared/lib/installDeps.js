const execa = require("execa");

const DEV_DEBUG = process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG";

/**
 *
 * @param {Array} deps 依赖列表
 * @param {string} root  安装的根目录
 */
module.exports = (deps, root) => {
  let pckManager = "npm";
  try {
    if (DEV_DEBUG) {
      execa.sync("tnpm", ["-v"]);
      pckManager = "tnpm";
    }
  } catch (x) {}
  if (deps) {
    deps.map(dep => {
      return execa.sync(pckManager, ["install", dep], {
        cwd: root,
        stdio: "inherit"
      });
    });
    return;
  }
  execa.sync(pckManager, ["install"], {
    cwd: root,
    stdio: "inherit"
  });
};
