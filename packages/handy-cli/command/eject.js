module.exports = {
  command: "eject",
  description: "exports webpack config ",
  action: appName => {
    require("../lib/eject")(appName);
  }
};
