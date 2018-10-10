const execa = require("execa");

/**
 *
 * @param {Array} deps
 * @param {string} root
 */
module.exports = (deps, root) => {
  if (deps) {
    deps.map(dep => {
      return execa.sync("tnpm", ["install", dep], {
        cwd: root,
        stdio: "inherit"
      });
    });
    return;
  }
  execa.sync("tnpm", ["install"], {
    cwd: root,
    stdio: "inherit"
  });
};
