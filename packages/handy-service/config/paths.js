const path = require("path");
const fs = require("fs");
const url = require("url");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);
const envPublicUrl = process.env.PUBLIC_URL;

function ensureSlash(inputPath, needsSlash) {
  const hasSlash = inputPath.endsWith("/");
  if (hasSlash && !needsSlash) {
    return inputPath.substr(0, inputPath.length - 1);
  }
  if (!hasSlash && needsSlash) {
    return `${inputPath}/`;
  }
  return inputPath;
}

const getPublicUrl = appPackageJson => envPublicUrl || require(appPackageJson).homepage;

const getAppPackageJsonProp = (appPackageJson, prop) => require(appPackageJson)[prop];

function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl = envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : "/");
  return ensureSlash(servedUrl, true);
}

const useTypescript = () => {
  const presets = getAppPackageJsonProp(appPkgJson, "presets");
  return presets.features.includes("typescript");
};

const appPkgJson = resolveApp("package.json");

const paths = {
  dotenv: resolveApp(".env"),
  appPath: resolveApp("."),
  appBuild: resolveApp("build"),
  appPublic: resolveApp("public"),
  appHtml: resolveApp("public/index.html"),
  appPackageJson: appPkgJson,
  appSrc: resolveApp("src"),
  yarnLockFile: resolveApp("yarn.lock"),
  testsSetup: resolveApp("src/setupTests.js"),
  proxySetup: resolveApp("src/setupProxy.js"),
  appNodeModules: resolveApp("node_modules"),
  publicUrl: getPublicUrl(appPkgJson),
  servedPath: getServedPath(appPkgJson),
  appName: getAppPackageJsonProp(appPkgJson, "name"),
  appPresets: getAppPackageJsonProp(appPkgJson, "presets"),
  useTypescript: useTypescript()
};

module.exports = paths;
