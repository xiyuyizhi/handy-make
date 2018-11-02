const fs = require("fs-extra");
const path = require("path");

module.exports = (root, fileName, content) => {
  fs.writeFileSync(path.join(root, fileName), JSON.stringify(content, null, 2));
};
