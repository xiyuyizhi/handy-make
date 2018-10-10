const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");
const symlink = require("handy-utils/symlink");
const demoExclude = {
  normal: ["src/stores", "src/pages/mobx", "src/pages/redux", "src/modules/mobxGitSearch"],
  mobx: ["src/pages/index", "src/pages/redux", "src/modules/indexGitSearch"]
};

// state management  deps
const pkgStateDependencies = {
  mobx: {
    mobx: "^5.5.0",
    "mobx-react": "^5.2.8"
  }
};

const DEV_DEBUG = process.env.NODE_ENV === "DEV" || process.env.NODE_ENV === "DEBUG";

module.exports = (appDir, answers) => {
  const { state = "normal" } = answers;

  execa.sync("cp", ["-r", path.join(__dirname, "demo", "public"), appDir]);
  execa.sync("cp", ["-r", path.join(__dirname, "demo", "src"), appDir]);

  demoExclude[state].forEach(p => {
    execa.sync("rm", ["-r", path.join(appDir, p)]);
  });

  const pkg = fs.readJsonSync(path.join(appDir, "package.json"));

  const appDeps = Object.assign(
    pkg.dependencies,
    {
      react: "^16.5.2",
      "react-dom": "^16.5.2",
      "react-router-dom": "^4.3.1",
      "whatwg-fetch": "^3.0.0",
      "handy-demo-common": "^0.0.1"
    },
    pkgStateDependencies[state] || {}
  );
  pkg.dependencies = appDeps;
  fs.writeFileSync(path.join(appDir, "package.json"), JSON.stringify(pkg, null, 2));

  // install deps
  console.log("install dependencies.....");
  if (DEV_DEBUG) {
    Object.keys(appDeps)
      .map(key => `${key}@${appDeps[key]}`)
      .forEach(dep => {
        if (dep.indexOf("handy-demo-common") !== -1) {
          symlink(
            path.join(__dirname, "../", "handy-demo-common"),
            path.join(appDir, "node_modules", "handy-demo-common")
          );
        } else {
          console.log(dep);
          execa.sync("npm", ["install", dep], {
            cwd: appDir,
            stdio: "inherit"
          });
        }
      });
  } else {
    execa.sync("npm", ["install"], {
      cwd: appDir,
      stdio: "inherit"
    });
  }
};
