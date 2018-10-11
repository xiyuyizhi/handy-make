module.exports = {
  command: "create <app-name>",
  description: "create new project",
  action: appName => {
    require("../lib/create")(appName);
  }
};
