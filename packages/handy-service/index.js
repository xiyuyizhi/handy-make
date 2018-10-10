const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const { symlink, getPkgVersion, installDeps } = require("handy-utils-shared");

const demoExclude = {
  normal: ["src/stores", "src/pages/mobx", "src/pages/redux", "src/modules/mobxGitSearch"],
  mobx: ["src/pages/normal", "src/pages/redux", "src/modules/normalGitSearch"]
};

// state management  deps
const pkgStateDependencies = {
  mobx: {
    mobx: "^5.5.0",
    "mobx-react": "^5.2.8"
  }
};

const DEV_DEBUG = process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG";

module.exports = async (appDir, answers) => {
  const { state = "normal" } = answers;

  execa.sync("cp", ["-r", path.join(__dirname, "demo", "public"), appDir]);
  execa.sync("cp", ["-r", path.join(__dirname, "demo", "src"), appDir]);

  demoExclude[state].forEach((p) => {
    execa.sync("rm", ["-r", path.join(appDir, p)]);
  });

  execa.sync("mv", [path.join(appDir, "src/pages", state), path.join(appDir, "/src/pages/index")]);

  const pkg = fs.readJsonSync(path.join(appDir, "package.json"));

  const currentModuleVersion = getPkgVersion(path.join(__dirname, "package.json"));

  const appDeps = Object.assign(
    pkg.dependencies,
    {
      react: "^16.5.2",
      "react-dom": "^16.5.2",
      "react-router-dom": "^4.3.1",
      "whatwg-fetch": "^3.0.0",
      "handy-demo-common": `^${currentModuleVersion}`
    },
    pkgStateDependencies[state] || {},
  );
  pkg.dependencies = appDeps;
  fs.writeFileSync(path.join(appDir, "package.json"), JSON.stringify(pkg, null, 2));

  // install deps
  console.log(chalk.green("install dependencies....."));
  if (DEV_DEBUG) {
    const excludeDemoCommon = Object.keys(appDeps)
      .map(key => `${key}@${appDeps[key]}`)
      .filter(dep => dep.indexOf("handy-demo-common") === -1);
    try {
      await installDeps(excludeDemoCommon, appDir);
      symlink(
        path.join(__dirname, "../", "handy-demo-common"),
        path.join(appDir, "node_modules", "handy-demo-common"),
      );
    } catch (x) {
      console.log(chalk.red("install deps error"));
      console.log(x);
    }
  } else {
    installDeps(null, appDeps);
  }
  console.log(chalk.green("install deps success....."));
};
