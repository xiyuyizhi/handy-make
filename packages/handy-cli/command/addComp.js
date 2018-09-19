module.exports = {
  command: "addComp <comp-name>",
  description: "新建组件",
  action: (compName, cmd) => {
    console.log(compName);
    console.log(cmd);
  }
};
