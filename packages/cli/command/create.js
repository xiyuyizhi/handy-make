module.exports = {
  command: "create <app-name>",
  description: "创建新项目",
  action: appName => {
    require("../lib/create")(appName);
  }
};
