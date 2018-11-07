module.exports = {
  command: "eject",
  description: "export webpack config",
  action: appName => {
    require("../lib/eject")(appName);
  }
};
