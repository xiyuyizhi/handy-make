const chalk = require("chalk");
const path = require("path");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");
const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const ReplaceHtmlPlugin = require("./replaceHtmlPlugin");
const paths = require("./paths");
const multiPage = require("./multiPage");
const getClientEnvironment = require("./env");

const publicPath = "/";
const publicUrl = " ";
const env = getClientEnvironment(publicUrl);
const outputFileName = "[name].js";
const outputChunkFilename = "[name].chunk.js";

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const sassRegex = /\.sass$/;
const sassModuleRegex = /\.module\.sass$/;
const stylusRegex = /.styl$/;
const stylusModuleRegex = /\.module\.styl$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    require.resolve("style-loader"),
    {
      loader: require.resolve("css-loader"),
      options: cssOptions
    },
    {
      loader: require.resolve("postcss-loader"),
      options: {
        ident: "postcss",
        plugins: () => [
          require("postcss-flexbugs-fixes"),
          autoprefixer({
            flexbox: "no-2009"
          })
        ]
      }
    }
  ];
  if (preProcessor) {
    loaders.push(require.resolve(preProcessor));
  }
  return loaders;
};

const config = {
  mode: "development",
  devtool: "cheap-module-source-map",
  entry: multiPage.appEntries,
  output: {
    filename: outputFileName,
    chunkFilename: outputChunkFilename,
    publicPath
  },
  resolve: {
    extensions: [".web.js", ".mjs", ".js", ".json", ".web.jsx", ".jsx"],
    alias: {
      components: path.resolve(paths.appPath, "src", "components"),
      modules: path.resolve(paths.appPath, "src", "modules"),
      utils: path.resolve(paths.appPath, "src", "utils"),
      common: path.resolve(paths.appPath, "src", "common"),
      stores: path.resolve(paths.appPath, "src", "stores"),
      context: path.resolve(paths.appPath, "src", "contexts")
    },
    plugins: [new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])]
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: true
    }
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        enforce: "pre",
        test: /\.js$/,
        loader: require.resolve("source-map-loader")
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve("url-loader"),
            options: {
              limit: 10000,
              name: "static/media/[name].[hash:8].[ext]"
            }
          },
          {
            test: /\.(js|jsx|mjs)$/,
            include: paths.appSrc,
            loader: require.resolve("babel-loader"),
            options: {
              presets: [
                [
                  require("@babel/preset-env"),
                  {
                    useBuiltIns: "entry"
                  }
                ],
                [
                  require("@babel/preset-react"),
                  {
                    development: true
                  }
                ]
              ],
              plugins: [
                [
                  require("@babel/plugin-proposal-decorators"),
                  { legacy: true }
                ],
                [
                  require("@babel/plugin-proposal-class-properties"),
                  { loose: true }
                ]
              ]
            }
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1
            })
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              modules: true
            })
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders({ importLoaders: 2 }, "sass-loader")
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              { importLoaders: 2, modules: true },
              "sass-loader"
            )
          },
          {
            test: lessRegex,
            exclude: lessModuleRegex,
            use: getStyleLoaders({ importLoaders: 2 }, "less-loader")
          },
          {
            test: lessModuleRegex,
            use: getStyleLoaders(
              { importLoaders: 2, modules: true },
              "less-loader"
            )
          },
          {
            test: stylusRegex,
            exclude: stylusModuleRegex,
            use: getStyleLoaders({ importLoaders: 2 }, "stylus-loader")
          },
          {
            test: stylusModuleRegex,
            use: getStyleLoaders(
              { importLoaders: 2, modules: true },
              "stylus-loader"
            )
          },
          {
            exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/],
            loader: require.resolve("file-loader"),
            options: {
              name: "static/media/[name].[hash:8].[ext]"
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new ReplaceHtmlPlugin(env.raw),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin(env.stringified),
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
      PropTypes: "prop-types"
    }),
    new webpack.HotModuleReplacementPlugin(),
    new CaseSensitivePathsPlugin(),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ],
  node: {
    dgram: "empty",
    fs: "empty",
    net: "empty",
    tls: "empty",
    child_process: "empty"
  }
};

config.plugins = [...multiPage.htmlWebpackPlugins, ...config.plugins];

const presets = paths.appPresets;

if (!presets) {
  console.log(chalk.red("package.json not includes presets field"));
  process.exit(1);
}

[
  "handy-cli-plugin-typescript/extendWebpack",
  "handy-cli-plugin-linter/extendWebpack"
].forEach(plugin => {
  require(plugin)(config, presets, paths, "DEV");
});

module.exports = config;
