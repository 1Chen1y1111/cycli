"use strict";

module.exports = core;

const semver = require("semver");
const colors = require("colors");
const log = require("@cycli/log");
const pkg = require("../package.json");
const constant = require("./const");

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
  } catch (e) {
    log.error(e.message);
  }
}

/**
 * 检查root账户
 */
function checkRoot() {
  const rootCheck = require("root-check");
  rootCheck();
}

/**
 * 检查node版本号
 */
function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestNodeVersion = constant.LOWEST_NODE_VERSION;

  if (!semver.gte(currentVersion, lowestNodeVersion)) {
    throw new Error(
      colors.red(`cycli 需要安装 v${lowestNodeVersion} 以上版本的Node.js`)
    );
  }
}

/**
 * 检查版本号
 */
function checkPkgVersion() {
  log.notice("cli", pkg.version);
}
