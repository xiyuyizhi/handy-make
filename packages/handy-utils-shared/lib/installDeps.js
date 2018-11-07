const execa = require("execa");

const DEV_DEBUG = process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG";

/**
 *
 * @param {Array} deps 依赖列表
 * @param {string} root  安装的根目录
 */
module.exports = (deps, root, manager) => {
  let pkgManager = manager || "npm";

  try {
    if (DEV_DEBUG) {
      execa.sync("tnpm", ["-v"]);
      pkgManager = "tnpm";
    }
  } catch (x) {}

  if (deps) {
    deps.map(dep => {
      const args = pkgManager === "yarn" ? ["add", dep] : ["install", dep];
      return execa.sync(pkgManager, args, {
        cwd: root,
        stdio: "inherit"
      });
    });
    return;
  }
  execa.sync(pkgManager, ["install"], {
    cwd: root,
    stdio: "inherit"
  });
};
