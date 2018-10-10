const inquirer = require("inquirer");
const defaultPreset = require("../util/defaultPreset");
class Confirm {
  constructor(appName, promptsList) {
    this.appName = appName;
    this.confirmList = [];
    this.pluginsCallback = [];
    this.presets = this.presetList();
    this.plugins = ["handy-service"]; // 存贮选择的feature对象的plugin模块
    this.featureList = {
      type: "checkbox",
      name: "features",
      message: "手动选择",
      when: answers => {
        return answers.preset === "manual";
      },
      choices: []
    };
    this.promptBelowFeature = [];
    promptsList.forEach(prompt => {
      prompt(this);
    });
  }

  async confirm() {
    this.confirmList = [
      ...this.presets,
      this.featureList,
      ...this.promptBelowFeature
    ];
    let answers = await inquirer.prompt(this.confirmList);
    if (answers.preset === "default") {
      answers = defaultPreset;
    }
    this.pluginsCallback.forEach(fn => {
      fn(answers);
    });
    return {
      answers,
      plugins: this.plugins
    };
  }

  presetList() {
    return [
      {
        type: "list",
        name: "preset",
        message: "请选择要包含的特性",
        choices: [
          {
            name:
                            "default(eslint,unit test,state-management:reactContextApi)",
            value: "default"
          },
          {
            name: "手动选择",
            value: "manual"
          }
        ]
      }
    ];
  }

  addFeature(feature) {
    this.featureList.choices.push(feature);
  }

  addChoicesBelowFeature(choice) {
    if (Array.isArray(choice)) {
      this.promptBelowFeature = [...this.promptBelowFeature, ...choice];
    } else {
      this.promptBelowFeature = [...this.promptBelowFeature, choice];
    }
  }

  addPluginsCallback(fn) {
    this.pluginsCallback.push(fn);
  }
}

module.exports = Confirm;
