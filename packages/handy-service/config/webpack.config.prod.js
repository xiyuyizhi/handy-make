const path = require("path");
const chalk = require("chalk");
const autoprefixer = require("autoprefixer");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const ManifestPlugin = require("webpack-manifest-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const ReplaceHtmlPlugin = require("./replaceHtmlPlugin");
const paths = require("./paths");
const multiPage = require("./multiPage");
const getClientEnvironment = require("./env");

const publicPath = paths.servedPath;
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);
const outputFileName = "[name].[chunkhash:8].js";
const outputChunkFilename = "[name].[chunkhash:8].chunk.js";
const cssFilename = "[name].[contenthash:8].css";

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
const sassRegex = /\.sass$/;
const sassModuleRegex = /\.module\.sass$/;
const stylusRegex = /.styl$/;
const stylusModuleRegex = /\.module\.styl$/;

const shouldUseSourceMap = process.env.SOURCEMAP !== "false";

if (env.stringified["process.env"].NODE_ENV !== "\"production\"") {
  throw new Error("Production builds must have NODE_ENV=production.");
}

const getStyleLoaders = (cssOptions, preProcessor) => {
  const loaders = [
    MiniCssExtractPlugin.loader,
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
        ],
        sourceMap: shouldUseSourceMap
      }
    }
  ];
  if (preProcessor) {
    loaders.push({
      loader: require.resolve(preProcessor),
      options: {
        sourceMap: shouldUseSourceMap
      }
    });
  }
  return loaders;
};

const config = {
  mode: "production",
  devtool: shouldUseSourceMap ? "source-map" : false,
  entry: multiPage.appEntries,
  output: {
    path: paths.appBuild,
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
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false
          },
          mangle: {
            safari10: true
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: shouldUseSourceMap
      }),
      new OptimizeCSSAssetsPlugin({ cssProcessorOptions: { safe: true } })
    ],
    splitChunks: {
      chunks: "all",
      name: true
    }
  },
  module: {
    strictExportPresence: true,
    rules: [
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
                    useBuiltIns: "entry",
                    modules: false
                  }
                ],
                [
                  require("@babel/preset-react"),
                  {
                    development: false
                  }
                ]
              ],
              compact: true,
              plugins: [
                [require("@babel/plugin-proposal-decorators"), { legacy: true }],
                [require("@babel/plugin-proposal-class-properties"), { loose: true }]
              ]
            }
          },
          {
            test: cssRegex,
            exclude: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              sourceMap: shouldUseSourceMap
            })
          },
          {
            test: cssModuleRegex,
            use: getStyleLoaders({
              importLoaders: 1,
              modules: true,
              sourceMap: shouldUseSourceMap
            })
          },
          {
            test: sassRegex,
            exclude: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: shouldUseSourceMap
              },
              "sass-loader"
            )
          },
          {
            test: sassModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: true,
                sourceMap: shouldUseSourceMap
              },
              "sass-loader"
            )
          },
          {
            test: lessRegex,
            exclude: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: shouldUseSourceMap
              },
              "less-loader"
            )
          },
          {
            test: lessModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: true,
                sourceMap: shouldUseSourceMap
              },
              "less-loader"
            )
          },
          {
            test: stylusRegex,
            exclude: stylusModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                sourceMap: shouldUseSourceMap
              },
              "stylus-loader"
            )
          },
          {
            test: stylusModuleRegex,
            use: getStyleLoaders(
              {
                importLoaders: 2,
                modules: true,
                sourceMap: shouldUseSourceMap
              },
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
    new webpack.DefinePlugin(env.stringified),
    new webpack.ProvidePlugin({
      React: "react",
      ReactDOM: "react-dom",
      PropTypes: "prop-types"
    }),
    new MiniCssExtractPlugin({
      filename: cssFilename,
      chunkFilename: "[name].[hash].css"
    }),
    new ManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath
    }),
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

let extendWebpackPlugins;

extendWebpackPlugins = ["./extends/tsExtendWebpack", "./extends/linterExtendWebpack"];

// @remove-before-eject
extendWebpackPlugins = [
  "handy-cli-plugin-typescript/extendWebpack",
  "handy-cli-plugin-linter/extendWebpack"
];
// @remove-end-eject

extendWebpackPlugins.forEach(plugin => {
  require(plugin)(config, presets, paths, "PRODUCTION");
});

module.exports = config;
