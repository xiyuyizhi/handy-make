module.exports = api => {
  api.addFeature({
    name: "linter",
    value: "linter"
  });

  api.addChoicesBelowFeature({
    type: "list",
    name: "linter",
    message: "linter type",
    when: answers => answers.features
      && answers.features.includes("linter")
      && !answers.features.includes("typescript"),
    choices: [
      {
        name: "eslint with prettier",
        value: "eslint_prettier"
      },
      {
        name: "eslint with airbnb",
        value: "eslint_airbnb"
      },
      {
        name: "eslint with ali config",
        value: "eslint_ali"
      }
    ]
  });

  api.addChoicesBelowFeature({
    type: "list",
    name: "lintCondition",
    message: "lint condition",
    when: answers => answers.features && answers.features.includes("linter"),
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
    if (answers.features.includes("linter")) {
      api.plugins.push("handy-cli-plugin-linter");
    }
  });
};
