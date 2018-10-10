const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");

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

  [".gitignore", "public", "src"].forEach(x => {
    execa.sync("cp", ["-r", path.join(__dirname, "demo", x), appDir]);
  });

  demoExclude[state].forEach(p => {
    execa.sync("rm", ["-r", path.join(appDir, p)]);
  });

  execa.sync("mv", [path.join(appDir, "src/pages", state), path.join(appDir, "/src/pages/index")]);

  const pkg = fs.readJsonSync(path.join(appDir, "package.json"));

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
  fs.writeFileSync(path.join(appDir, "package.json"), JSON.stringify(pkg, null, 2));
};
