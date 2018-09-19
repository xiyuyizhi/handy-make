const fs = require("fs-extra");
const path = require("path");

module.exports = {
  getModuleList: dir => {
    return fs.readdirSync(dir).map(x => {
      return require(path.resolve(dir, x));
    });
  }
};
