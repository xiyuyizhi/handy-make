const fs = require("fs-extra");
const chalk = require("chalk");
class Package {
  write(path, content) {
    fs.writeFileSync(path, content);
    console.log(chalk.green("生成package.json"));
  }
}

module.exports = Package;
