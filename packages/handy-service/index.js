const execa = require("execa");
const path = require("path");
const fs = require("fs-extra");
const demoExclude = {
  normal: [
    "src/stores",
    "src/pages/mobx",
    "src/pages/redux",
    "src/modules/mobxGitSearch"
  ],
  mobx: ["src/pages/index", "src/pages/redux", "src/modules/indexGitSearch"]
};

const pkgDependencies = {
  mobx: {
    mobx: "^5.5.0",
    "mobx-react": "^5.2.8"
  }
};

module.exports = (appDir, answers) => {
  console.log("ooooo");

  const { state = "normal" } = answers;

  execa.sync("cp", ["-r", path.join(__dirname, "demo", "public"), appDir]);
  execa.sync("cp", ["-r", path.join(__dirname, "demo", "src"), appDir]);

  demoExclude[state].forEach(p => {
    execa.sync("rm", ["-r", path.join(appDir, p)]);
  });

  const pkg = fs.readJsonSync(path.join(appDir, "package.json"));
  pkg.dependencies = Object.assign(
    pkg.dependencies,
    {
      react: "^16.5.2",
      "react-dev-utils": "^5.0.2",
      "react-dom": "^16.5.2",
      "react-router-dom": "^4.3.1",
      "whatwg-fetch": "^3.0.0"
      // "handy-demo-common": "0.0.1"
    },
    pkgDependencies[state] || {}
  );
  fs.writeFileSync(
    path.join(appDir, "package.json"),
    JSON.stringify(pkg, null, 2)
  );

  // install depens
  console.log("install dependencies.....");
  execa.sync("npm", ["install"], {
    cwd: appDir,
    stdio: "inherit"
  });
};
