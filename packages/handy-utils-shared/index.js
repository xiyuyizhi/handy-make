function getPkgVersion(path) {
  return require(path).version;
}

module.exports = {
  symlink: require("./lib/symlink"),
  installDeps: require("./lib/installDeps"),
  getPkgVersion
};
