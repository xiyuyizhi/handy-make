const inquirer = require("inquirer");
const fs = require("fs-extra");
const execa = require("execa");
const chalk = require("chalk");
const path = require("path");
const { extendPkgJson, installDeps } = require("handy-utils-shared");

const DEV_DEBUG = process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG";

module.exports = async () => {
  const { ensureInject } = await inquirer.prompt({
    type: "confirm",
    name: "ensureInject",
    message: "ensure to inject webpack config to project?"
  });
  if (!ensureInject) return;

  // check git status
  const { stdout } = execa.sync("git", ["status", "--porcelain"], {
    stdio: "pipe"
  });

  if (stdout) {
    console.error(
      chalk.red("This git repository has untracked files or uncommitted changes:")
        + "\n\n"
        + stdout
          .split("\n")
          .map(line => line.match(/ .*/g)[0].trim())
          .join("\n")
        + "\n\n"
        + chalk.red("Remove untracked files, stash or commit any changes, and try again.")
    );
    process.exit(1);
  }

  console.log("eject...");

  // copy necessary files
  const handyServiceRoot = path.resolve(__dirname, "../", "node_modules", "handy-service");
  const appRoot = process.cwd();

  ["config", "scripts"].forEach(dir => {
    execa.sync("cp", ["-r", path.join(handyServiceRoot, dir), appRoot]);
  });

  // copy  extendWebpack file to appRoot/config
  const extendsPlugins = {
    "handy-cli-plugin-linter": "linter_extendWebpack.js",
    "handy-cli-plugin-typescript": "ts_extendWebpack.js"
  };
  Object.keys(extendsPlugins).forEach(dep => {
    const content = fs.readFileSync(
      path.join(handyServiceRoot, "node_modules", dep, "extendWebpack.js")
    );
    fs.writeFileSync(path.join(appRoot, "config", extendsPlugins[dep]), content);
  });

  // remove not used content in webpack.config.dev.js、webpack.config.prod.js
  ["webpack.config.dev.js", "webpack.config.prod.js"].forEach(file => {
    const configPath = path.join(appRoot, "config", file);
    let content = fs.readFileSync(configPath, { encoding: "utf8" });
    content = content.replace(/\/\/\s+@remove-before-eject[^@]+@remove-end-eject/g, "");
    fs.writeFileSync(configPath, content, { encoding: "utf8" });
  });

  // extends project package.json
  const { dependencies } = extendPkgJson(handyServiceRoot, true);
  extendPkgJson(appRoot)(pkg => {
    pkg.devDependencies = Object.assign({}, pkg.devDependencies, dependencies);

    [
      "handy-service",
      "handy-demo-app",
      "handy-utils-shared",
      "handy-cli-plugin-typescript",
      "handy-cli-plugin-linter"
    ].forEach(x => delete pkg.devDependencies[x]);

    pkg.scripts = Object.assign(pkg.scripts, {
      start: "node scripts/serve",
      build: "node scripts/build"
    });
    return pkg;
  });

  // install deps
  if (!DEV_DEBUG) {
    try {
      installDeps(null, appRoot);
    } catch (x) {
      console.log(x);
      process.exit(1);
    }
  }

  console.log(chalk.green("inject success..."));

  execa.sync("git", ["add", "."]);
  execa.sync("git", ["commit", "-m", "add eject"]);
};
