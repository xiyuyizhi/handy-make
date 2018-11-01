const fs = require("fs-extra");
const path = require("path");

function geneTsConfigJson(appDir) {
  let tslintJson = require("./config/tsconfig.json");
  fs.writeFileSync(path.join(appDir, "tsconfig.json"), JSON.stringify(tslintJson, null, 2));
}

module.exports = appDir => {
  geneTsConfigJson(appDir);
};
