#!/usr/bin/env node

console.log(process.argv);
const path = require("path");
const execa = require("execa");

const args = process.argv.slice(2);

const command = args[0];

execa("node", [path.resolve(__dirname, "../scripts/", command)], {
  stdio: "inherit",
  cwd: process.cwd()
});
