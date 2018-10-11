const inquirer = require("inquirer");
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

  // copy necessary files

  console.log("eject...");
  const handyServiceRoot = path.resolve(__dirname, "../", "node_modules", "handy-service");
  const appRoot = process.cwd();

  ["config", "scripts"].forEach(dir => {
    execa.sync("cp", ["-r", path.join(handyServiceRoot, dir), appRoot]);
  });

  const { dependencies } = extendPkgJson(handyServiceRoot, true);

  // extends project package.json
  extendPkgJson(appRoot)(pkg => {
    pkg.devDependencies = Object.assign(pkg.devDependencies, dependencies);
    delete pkg.devDependencies["handy-service"];
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
