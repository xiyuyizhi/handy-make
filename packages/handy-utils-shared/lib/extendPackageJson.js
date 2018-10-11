const fs = require("fs-extra");
const path = require("path");

/**
 * provide callback to extends package.son
 */
module.exports = (appPath, readOnly) => {
  const pkgPath = path.join(appPath, "package.json");
  const pkgJson = fs.readJSONSync(pkgPath);
  if (readOnly) return pkgJson;
  return extendFn => {
    const pkg = extendFn(pkgJson);
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
  };
};
