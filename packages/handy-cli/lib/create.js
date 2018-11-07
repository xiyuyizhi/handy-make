const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const inquirer = require("inquirer");
const execa = require("execa");
const {
  symlink,
  installDeps,
  extendPkgJson,
  writeJsonToRoot
} = require("handy-utils-shared");
const { getModuleList } = require("../util/getModuleList");
const Prompt = require("./Prompt.js");

const DEV_DEBUG = process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG";
const DEV_INSTALL = process.env.TEST_INSTALL === "true";

async function creator(appName) {
  const appDir = path.resolve(process.cwd(), appName);

  if (fs.existsSync(appDir)) {
    const { override } = await inquirer.prompt([
      {
        type: "confirm",
        name: "override",
        message: chalk.red(`directory ${appName} exist,override it?`)
      }
    ]);
    if (override) {
      console.log(chalk.green("removing..."));
      fs.removeSync(appDir);
    } else {
      process.exit(1);
    }
  }
  fs.mkdirSync(appDir);

  const prompt = new Prompt(
    appName,
    getModuleList(path.resolve(__dirname, "../", "prompts"))
  );
  const { answers, plugins } = await prompt.confirm();

  const pkg = {
    name: appName,
    version: "0.0.1",
    dependencies: {
      "handy-demo-common": "latest"
    },
    devDependencies: {
      "handy-service": "latest"
    },
    scripts: {
      start: "handy-service serve",
      build: "handy-service build"
    }
  };
  pkg.presets = answers;
  writeJsonToRoot(appDir, "package.json", pkg);

  execa.sync("git", ["init"], {
    cwd: appDir
  });
  console.log(chalk.green("git init success"));

  plugins.forEach(modu => {
    require(modu)(appDir, answers);
  });
  console.log(chalk.green("generate project skeleton success"));

  // install dependencies
  console.log(chalk.green("install dependencies..."));

  if (DEV_DEBUG) {
    try {
      if (DEV_INSTALL) {
        let appPkg = extendPkgJson(appDir, true);
        const { dependencies, devDependencies } = appPkg;
        await installDeps(
          Object.keys(dependencies)
            .map(key => `${key}${dependencies[key]}`.replace("^", "@"))
            .filter(dep => dep.indexOf("handy-demo-common") === -1),
          appDir,
          answers.pkgManager
        );
        await installDeps(
          Object.keys(devDependencies)
            .map(key => `${key}${devDependencies[key]}`.replace("^", "@"))
            .filter(dep => dep.indexOf("handy-service") === -1),
          appDir,
          answers.pkgManager
        );
      }

      fs.copySync(
        path.join(__dirname, "../../", "handy-demo-common"),
        path.join(appDir, "node_modules", "handy-demo-common")
      );
      symlink(
        require.resolve("handy-service/bin/handy-service"),
        path.join(appDir, "node_modules", ".bin", "handy-service")
      );
    } catch (x) {
      console.log(chalk.red("install deps error"));
      console.log(x);
      process.exit(1);
    }
  } else {
    installDeps(null, appDir, answers.pkgManager);
  }
  console.log(chalk.green("install dependencies success"));

  // gene readme.md
  fs.writeFileSync(path.resolve(appDir, "readme.md"), `## ${appName}`);

  console.log(
    chalk.yellow(`
      now,you can ${chalk.red(`cd ${appName}`)},\n
      run ${chalk.red("npm run start")} to start server, \n
      and ${chalk.red("npm run build")} to build you app,\n
      if you want modify webpack config indeed,you can run ${chalk.red(
    "handy eject"
  )}
  `)
  );
}

module.exports = creator;
