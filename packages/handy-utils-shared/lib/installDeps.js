const execa = require("execa");

/**
 *
 * @param {Array} deps
 * @param {string} root
 */
module.exports = (deps, root) => {
  if (deps) {
    const promises = deps.map(dep => {
      return execa("npm", ["install", dep], {
        cwd: root,
        stdio: "pipe"
      });
    });
    return Promise.all(promises);
  }
  execa.sync("npm", ["install"], {
    cwd: root,
    stdio: "inherit"
  });
};
