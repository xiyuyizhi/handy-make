module.exports = api => {
  api.addFeature({
    name: "state management",
    value: "stateManagement"
  });

  api.addChoicesBelowFeature({
    type: "list",
    name: "state",
    message: "select then state manage mode to user",
    when: answers => {
      return answers.features && answers.features.includes("stateManagement");
    },
    choices: [
      {
        name: "default",
        value: "normal"
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
