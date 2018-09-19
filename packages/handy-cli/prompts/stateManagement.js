module.exports = api => {
  api.addFeature({
    name: "state management",
    value: "state"
  });

  api.addChoicesBelowFeature({
    type: "list",
    name: "state",
    message: "请选择要使用的状态管理方式",
    when: answers => {
      return answers.features && answers.features.includes("state");
    },
    choices: [
      {
        name: "default(reactContextApi)",
        value: "reactContextApi"
      },
      {
        name: "mobx",
        value: "mobx"
      },
      {
        name: "redux",
        value: "redux"
      },
      {
        name: "dva",
        value: "dva"
      }
    ]
  });
};
