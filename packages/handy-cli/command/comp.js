module.exports = {
  command: "comp <comp-name>",
  description: "create new component",
  action: compName => {
    require("../lib/comp")(compName);
  }
};
