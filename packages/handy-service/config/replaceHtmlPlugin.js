const escapeStringRegexp = require("escape-string-regexp");
const HtmlWebpackPlugin = require("html-webpack-plugin");
class ReplaceHtmlPlugin {
  constructor(replacements) {
    this.replacements = replacements;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap("ReplaceHtmlPlugin", compilation => {
      // compilation.hooks.htmlWebpackPluginAfterHtmlProcessing
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        "ReplaceHtmlPlugin",
        (data, callback) => {
          Object.keys(this.replacements).forEach(key => {
            const value = this.replacements[key];
            data.html = data.html.replace(
              new RegExp(`%${escapeStringRegexp(key)}%`, "g"),
              value
            );
          });
          callback(null, data);
        }
      );
    });
  }
}

module.exports = ReplaceHtmlPlugin;
