const fs = require("fs-extra");
const path = require("path");
const { extendPkgJson } = require("handy-utils-shared");

const pkgExtends = {
  tslint: {
    devDependencies: {
      typescript: "^3.1.3",
      tslint: "^5.11.0",
      "tslint-react": "^3.6.0"
    }
  },
  eslint_airbnb: {
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
  eslint_prettier: {
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

const eslintWhenCommit = linter => {
  const l = linter === "tslint"
    ? {
      "*.{ts,tsx}": ["tslint -c tslint.json --fix", "git add"]
    }
    : {
      "*.{js,jsx}": ["eslint --fix", "git add"]
    };

  return {
    husky: {
      hooks: {
        "pre-commit": "lint-staged"
      }
    },
    "lint-staged": {
      linters: l,
      ignore: ["**/build/**.js"]
    }
  };
};

function geneEslintrc(appDir, answer) {
  const { linter } = answer;
  let eslintrcTemp = require("./config/eslintrcTemp.json");
  eslintrcTemp = Object.assign(pkgExtends[linter].eslintrcExtend, eslintrcTemp);
  fs.writeFileSync(path.join(appDir, ".eslintrc"), JSON.stringify(eslintrcTemp, null, 2));
}

function geneTslintJson(appDir) {
  let tslintJson = require("./config/tslintTemp.json");
  fs.writeFileSync(path.join(appDir, "tslint.json"), JSON.stringify(tslintJson, null, 2));
}

function extendPkg(appDir, lintType) {
  extendPkgJson(appDir)(pkg => {
    pkg = Object.assign(pkg, eslintWhenCommit(lintType));
    pkg.devDependencies = Object.assign(
      pkg.devDependencies,
      {
        "lint-staged": "^7.3.0",
        husky: "^1.1.1"
      },
      pkgExtends[lintType].devDependencies
    );
    return pkg;
  });
}

module.exports = (appDir, answer) => {
  const { lintCondition, linter } = answer;
  if (answer.linter.indexOf("eslint") !== -1) {
    geneEslintrc(appDir, answer);
  }
  if (answer.linter === "tslint") {
    geneTslintJson(appDir);
  }
  if (lintCondition === "commit") {
    extendPkg(appDir, linter);
  }
};
