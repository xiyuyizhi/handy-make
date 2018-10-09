const fs = require("fs");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const appDirectory = fs.realpathSync(process.cwd());

const pagesPaths = path.join(appDirectory, "src", "pages");
const pages = fs.readdirSync(pagesPaths);

function getEntries() {
  return pages.reduce((all, page) => {
    all[page] = [path.join(appDirectory, "src", "pages", page)];
    if (process.env.NODE_ENV !== "production") {
      all[page].unshift(require.resolve("react-dev-utils/webpackHotDevClient"));
    }
    return all;
  }, {});
}

function addHtmlWebpackPlugins() {
  return pages.reduce((all, page) => {
    const options = {
      inject: true,
      chunks: [page],
      template: path.join(appDirectory, "public/index.html"),
      filename: `${page}.html`
    };
    if (process.env.NODE_ENV === "production") {
      options.minify = {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      };
    }
    all.push(new HtmlWebpackPlugin(options));
    return all;
  }, []);
}

function getHistoryApiRewrites() {
  const rewrites = pages.reduce((all, page) => {
    all.push({
      from: new RegExp(`\\/${page}`),
      to: `/${page}.html`
    });
    return all;
  }, []);
  rewrites.push({ from: /.*/, to: "/index.html" });
  return rewrites;
}

module.exports = {
  appEntries: getEntries(),
  htmlWebpackPlugins: addHtmlWebpackPlugins(),
  historyApiRewrites: getHistoryApiRewrites()
};
