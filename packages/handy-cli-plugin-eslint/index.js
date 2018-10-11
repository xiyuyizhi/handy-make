const fs = require("fs-extra");
const path = require("path");
const { extendPkgJson } = require("handy-utils-shared");

const pkgExtends = {
  airbnb: {
    devDependencies: {
      eslint: "^5.6.0",
      "eslint-config-airbnb": "^17.1.0",
      "eslint-plugin-import": "^2.14.0",
      "eslint-plugin-jsx-a11y": "^6.1.1",
      "eslint-plugin-react": "^7.11.1"
    },
    eslintrcExtend: {
      extends: "airbnb"
    }
  },
  prettier: {
    devDependencies: {
      eslint: "^5.6.0",
      prettier: "^1.14.3",
      "eslint-config-prettier": "^3.1.0",
      "eslint-plugin-prettier": "^2.7.0",
      "eslint-plugin-react": "^7.11.1"
    },
    eslintrcExtend: {
      extends: ["eslint:recommended", "plugin:react/recommended", "prettier", "prettier/react"],
      plugins: ["react", "prettier"]
    }
  }
};

const eslintWhenCommit = {
  husky: {
    hooks: {
      "pre-commit": "lint-staged"
    }
  },
  "lint-staged": {
    linters: {
      "*.{js,jsx}": ["eslint --fix", "git add"]
    },
    ignore: ["**/build/**.js"]
  }
};

function geneEslintrc(appDir, answer) {
  const { eslint } = answer;
  let eslintrcTemp = require("./eslintrcTemp.json");
  eslintrcTemp = Object.assign(pkgExtends[eslint].eslintrcExtend, eslintrcTemp);
  fs.writeFileSync(path.join(appDir, ".eslintrc"), JSON.stringify(eslintrcTemp, null, 2));
}

function extendPkg(appDir, eslintType) {
  extendPkgJson(appDir)(pkg => {
    pkg = Object.assign(pkg, eslintWhenCommit);
    pkg.devDependencies = Object.assign(
      pkg.devDependencies,
      {
        "lint-staged": "^7.3.0",
        husky: "^1.1.1"
      },
      pkgExtends[eslintType].devDependencies
    );
    return pkg;
  });
}

module.exports = (appDir, answer) => {
  if (answer.features.includes("eslint")) {
    const { eslintCondition, eslint } = answer;
    geneEslintrc(appDir, answer);
    if (eslintCondition === "commit") {
      extendPkg(appDir, eslint);
    }
  }
};
