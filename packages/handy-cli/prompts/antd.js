module.exports = api => {
  api.addFeature({
    name: "ant design",
    value: "antd"
  });

  api.addPluginsCallback(answers => {
    if (answers.features.includes("antd")) {
      api.plugins.push("handy-cli-plugin-antd");
    }
  });
};
