// https://github.com/Igorbek/typescript-plugin-styled-components#forked-process-configuration
// https://github.com/Brooooooklyn/ts-import-plugin

const tsImportPluginFactory = require("ts-import-plugin");
const getCustomTransformers = () => ({
  before: [
    tsImportPluginFactory({
      libraryName: "antd",
      libraryDirectory: "es",
      style: true
    })
  ]
});
module.exports = getCustomTransformers;
