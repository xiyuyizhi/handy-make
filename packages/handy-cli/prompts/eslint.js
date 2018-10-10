module.exports = api => {
  api.addFeature({
    name: "eslint",
    value: "eslint"
  });

  api.addChoicesBelowFeature({
    type: "list",
    name: "eslint",
    message: "eslint type",
    when: answers => answers.features && answers.features.includes("eslint"),
    choices: [
      {
        name: "eslint with prettier",
        value: "prettier"
      },
      {
        name: "eslint with airbnb",
        value: "airbnb"
      }
    ]
  });

  api.addChoicesBelowFeature({
    type: "list",
    name: "eslintCondition",
    message: "lint condition",
    when: answers => answers.features && answers.features.includes("eslint"),
    choices: [
      {
        name: "lint when save code",
        value: "save"
      },
      {
        name: "lint when commit code",
        value: "commit"
      }
    ]
  });

  api.addPluginsCallback(answers => {
    if (answers.features.includes("eslint")) {
      api.plugins.push("handy-cli-plugin-eslint");
    }
  });
};
