module.exports = (config, presets, paths) => {
  if (
    presets.linter.indexOf("eslint") !== -1
    && presets.lintCondition === "save"
  ) {
    // eslint when save
    config.module.rules.unshift({
      enforce: "pre",
      test: /\.(js|jsx)$/,
      include: paths.appSrc,
      exclude: /node_modules/,
      loader: require.resolve("eslint-loader"),
      options: {
        fix: true,
        cwd: paths.appPath,
        configFile: ".eslintrc"
      }
    });
  }
};
