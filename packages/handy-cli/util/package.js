const fs = require("fs-extra");

class Package {
  write(path, content) {
    fs.ensureFileSync(path);
    fs.writeFileSync(path, content);
  }
}

module.exports = Package;
