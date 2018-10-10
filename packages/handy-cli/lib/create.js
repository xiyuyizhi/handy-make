const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const inquirer = require("inquirer");
const execa = require("execa");
const { symlink, getPkgVersion, installDeps } = require("handy-utils-shared");
const { getModuleList } = require("../util/getModuleList");
const Prompt = require("./Prompt.js");

const DEV_DEBUG = process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG";

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
      fs.removeSync(appDir);
    } else {
      process.exit(1);
    }
  }

  fs.mkdirSync(appDir);

  const prompt = new Prompt(appName, getModuleList(path.resolve(__dirname, "../", "prompts")));
  const { answers, plugins } = await prompt.confirm();

  const cliVersion = getPkgVersion(path.join(__dirname, "../", "package.json"));

  const pkg = {
    name: appName,
    version: "0.0.1",
    dependencies: {
      "handy-demo-common": `^${cliVersion}`
    },
    devDependencies: {
      "handy-service": `^${cliVersion}`
    },
    scripts: {
      start: "handy-service serve",
      build: "handy-service build"
    }
  };
  pkg.presets = answers;

  fs.writeFileSync(path.resolve(appDir, "package.json"), JSON.stringify(pkg, null, 2));

  console.log(chalk.green("git init..."));
  execa.sync("git", ["init"], {
    cwd: appDir
  });

  console.log(chalk.green("generate project structure..."));
  plugins.forEach(modu => {
    require(modu)(appDir, answers);
  });

  // install dependencies
  console.log(chalk.green("install dependencies....."));
  const appPackage = path.join(appDir, "package.json");
  let appPkg = fs.readJsonSync(appPackage);
  const { dependencies, devDependencies } = appPkg;
  if (DEV_DEBUG) {
    try {
      await installDeps(
        Object.keys(dependencies)
          .map(key => `${key}${dependencies[key]}`.replace("^", "@"))
          .filter(dep => dep.indexOf("handy-demo-common") === -1),
        appDir
      );
      await installDeps(
        Object.keys(devDependencies)
          .map(key => `${key}${devDependencies[key]}`.replace("^", "@"))
          .filter(dep => dep.indexOf("handy-service") === -1),
        appDir
      );

      symlink(
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
    installDeps(null, appDir);
  }
  console.log(chalk.green("install dependencies finish"));

  console.log(
    chalk.yellow(`
      now,you can ${chalk.red(`cd ${appName}`)},\n
      run ${chalk.red("npm run start")} to start server, \n
      and ${chalk.red("npm run build")} to build you app
  `)
  );
}

module.exports = creator;
