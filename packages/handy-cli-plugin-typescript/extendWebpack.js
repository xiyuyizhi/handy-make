module.exports = (config, presets, paths, env) => {
  if (presets.linter === "tslint") {
    config.resolve.extensions.push(".ts", ".tsx");
    config.module.rules.unshift({
      enforce: "pre",
      test: /\.js$/,
      loader: require.resolve("source-map-loader")
    });
    config.module.rules.forEach(rule => {
      if (rule.oneOf) {
        rule.oneOf.unshift({
          test: /\.(ts|tsx)$/,
          include: paths.appSrc,
          loader: require.resolve("awesome-typescript-loader")
        });
      }
    });
  }

  if (presets.linter === "tslint" && presets.lintCondition === "save" && env === "DEV") {
    config.module.rules.unshift({
      test: /\.(ts|tsx)$/,
      enforce: "pre",
      use: [
        {
          loader: require.resolve("tslint-loader"),
          options: {
            emitErrors: true,
            fix: true
          }
        }
      ]
    });
  }
};
