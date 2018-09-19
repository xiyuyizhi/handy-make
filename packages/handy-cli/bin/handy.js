#!/usr/bin/env node

const semver = require("semver");
const chalk = require("chalk");
const commander = require("commander");
const path = require("path");
const requireVersion = require("../package.json").engines.node;
const cliVersion = require("../package.json").version;
const { getModuleList } = require("../util/getModuleList");
const commandDirPath = path.resolve(__dirname, "../", "command");

if (!semver.satisfies(process.version, requireVersion)) {
  console.log(chalk.red(`node版本过低!请升级到${requireVersion}`));
  process.exit(1);
}

commander.version(cliVersion);

getModuleList(commandDirPath).forEach(config => {
  commander
    .command(config.command)
    .description(config.description)
    .action(config.action);
});

commander.parse(process.argv);

if (!process.argv.slice(2).length) {
  commander.outputHelp();
}
