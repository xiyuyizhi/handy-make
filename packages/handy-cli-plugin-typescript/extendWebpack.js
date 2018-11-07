module.exports = (config, presets, paths, env) => {
  if (presets.features.includes("typescript")) {
    config.resolve.extensions.push(".ts", ".tsx");

    config.module.rules.forEach(rule => {
      if (rule.oneOf) {
        rule.oneOf.unshift({
          test: /\.(ts|tsx)$/,
          include: paths.appSrc,
          use: [
            {
              loader: require.resolve("thread-loader")
            },
            {
              loader: require.resolve("ts-loader"),
              options: {
                happyPackMode: true
              }
            }
          ]
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
