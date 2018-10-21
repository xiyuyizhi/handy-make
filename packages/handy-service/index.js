const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");
const { extendPkgJson } = require("handy-utils-shared");
const demoAppPath = path.join(__dirname, 'node_modules', 'handy-demo-app')
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

module.exports = async (appDir, answers) => {
  const { state = "normal" } = answers;

  ["public", "src"].forEach(x => {
    execa.sync("cp", ["-r", path.join(demoAppPath, x), appDir]);
  });

  const ignoreContent = "idea/\n.vscode/\nnode_modules\nbuild/\n.DS_Store";

  fs.writeFileSync(path.join(appDir, ".gitignore"), ignoreContent);

  demoExclude[state].forEach(p => {
    execa.sync("rm", ["-r", path.join(appDir, p)]);
  });

  execa.sync("mv", [path.join(appDir, "src/pages", state), path.join(appDir, "/src/pages/index")]);

  //remove not required  route
  const routePath = path.join(appDir, "/src/pages/index", 'routes.js')
  let routeContent = fs.readFileSync(routePath, { encoding: "utf8" })
  routeContent = routeContent.replace(/\/\/@remove-before-createApp[^@]+\/\/@remove-end-createApp/g, '')
  fs.writeFileSync(routePath, routeContent)

  extendPkgJson(appDir)(pkg => {
    const appDeps = Object.assign(
      pkg.dependencies,
      {
        react: "^16.5.2",
        "react-dom": "^16.5.2",
        "react-router-dom": "^4.3.1",
        "whatwg-fetch": "^3.0.0"
      },
      pkgStateDependencies[state] || {}
    );
    pkg.dependencies = appDeps;
    return pkg;
  });
};
