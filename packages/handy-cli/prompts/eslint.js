module.exports = api => {
  api.addFeature({
    name: "eslint",
    value: "eslint"
  });

  api.addChoicesBelowFeature({
    type: "list",
    name: "eslintCondition",
    message: "代码校验时机选择",
    when: answers => answers.features && answers.features.includes("eslint"),
    choices: [
      {
        name: "代码保存时校验",
        value: "save"
      },
      {
        name: "代码提交时校验",
        value: "commit"
      }
    ]
  });
};
