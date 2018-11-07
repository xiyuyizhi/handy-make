module.exports = api => {
  api.addFeature({
    name: "state management",
    value: "stateManage"
  });

  api.addChoicesBelowFeature({
    type: "list",
    name: "state",
    message: "select then state manage mode to user",
    when: answers => {
      return answers.features && answers.features.includes("stateManage");
    },
    choices: [
      {
        name: "default",
        value: "normal"
      },
      {
        name: "mobx",
        value: "mobx"
      }
      // {
      //   name: "dva",
      //   value: "dva"
      // }
    ]
  });
};
