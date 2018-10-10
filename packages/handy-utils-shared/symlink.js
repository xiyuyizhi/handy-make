const fs = require("fs-extra");
const path = require("path");
const cmdShim = require("util").promisify(require("cmd-shim"));

module.exports = async (src, dest) => {
  if (!(process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG")) {
    throw new Error("symlink should only be used during tests or debugging.");
  }
  if (process.platform === "win32" && !process.env.CI) {
    await cmdShim(src, dest);
  } else {
    await fs.ensureDir(path.dirname(dest));
    await fs.symlink(src, dest);
    await fs.chmod(dest, "755");
  }
};
