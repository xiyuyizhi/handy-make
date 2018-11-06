const execa = require("execa");

let hasYarn = false;
let hasNpm = true;
try {
  execa.sync("yarn", ["--version"]);
  hasYarn = true;
} catch (e) {}

try {
  execa.sync("npm", ["--version"]);
} catch (e) {
  hasNpm = false;
}

module.exports = {
  hasYarn,
  hasNpm
};
