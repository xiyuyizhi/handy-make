const fs = require("fs-extra");
const path = require("path");
if (process.argv.length < 3) {
  console.log("need  support  component  name");
  process.exit(1);
}

const compName = process.argv[2];
const compPath = path.join(compName, `${compName}.js`);
const tempPath = path.join(__dirname, "compTemp.js");
// if (fs.existsSync(compName)) {
//   console.log("component already exist  in current dir");
//   process.exit(1);
// }
fs.ensureDirSync(compName);
fs.ensureFileSync(compPath);
let code = fs.readFileSync(tempPath, { encoding: "utf8" });

code = code.replace(/_compName_/, compName);
code = code.replace(/_displayName_/, compName);

fs.writeFileSync(compPath, code);

console.log("create new component success");
