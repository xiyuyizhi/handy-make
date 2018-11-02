const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");
const { extendPkgJson } = require("handy-utils-shared");
const demoAppPath = path.join(__dirname, "node_modules", "handy-demo-app");
const demoAppTsPath = path.join(__dirname, "node_modules", "handy-demo-app-ts");
const demoExclude = {
  normal: [
    "src/stores",
    "src/pages/index",
    "src/pages/mobx",
    "src/pages/ts_mobx",
    "src/modules/mobxGitSearch"
  ],
  mobx: ["src/pages/index", "src/pages/normal", "src/pages/ts_mobx", "src/modules/normalGitSearch"]
};

// state management  deps
const pkgStateDependencies = {
  mobx: {
    mobx: "^5.5.0",
    "mobx-react": "^5.2.8"
  }
};

const typescriptDeps = {
  "@types/react": "^16.4.18",
  "@types/react-dom": "^16.0.9",
  "@types/react-router-dom": "^4.3.1"
};

module.exports = async (appDir, answers) => {
  const { state = "normal" } = answers;
  const useTypescript = answers.features.includes("typescript");
  ["public", "src"].forEach(x => {
    execa.sync("cp", ["-r", path.join(useTypescript ? demoAppTsPath : demoAppPath, x), appDir]);
  });

  const ignoreContent = ["idea/", ".vscode/", "node_modules", "build/", ".DS_Store"].join("\n");

  fs.writeFileSync(path.join(appDir, ".gitignore"), ignoreContent);

  const used = state;
  demoExclude[used].forEach(p => {
    execa.sync("rm", ["-r", path.join(appDir, p)]);
  });

  execa.sync("mv", [path.join(appDir, "src/pages", used), path.join(appDir, "/src/pages/index")]);

  // remove not required  route
  const routePath = path.join(appDir, "/src/pages/index", "routes.js");
  let routeContent = fs.readFileSync(routePath, { encoding: "utf8" });
  routeContent = routeContent.replace(
    /\/\/@remove-before-createApp[^@]+\/\/@remove-end-createApp/g,
    ""
  );
  fs.writeFileSync(routePath, routeContent);

  extendPkgJson(appDir)(pkg => {
    const appDeps = Object.assign(
      pkg.dependencies,
      {
        react: "^16.5.2",
        "react-dom": "^16.5.2",
        "react-router-dom": "^4.3.1",
        "whatwg-fetch": "^3.0.0"
      },
      pkgStateDependencies[state] || {},
      useTypescript ? typescriptDeps : {}
    );
    pkg.dependencies = appDeps;
    return pkg;
  });
};
