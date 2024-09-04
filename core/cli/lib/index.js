"use strict";

module.exports = core;

const path = require("path");
const semver = require("semver");
const colors = require("colors");
const userHome = require("user-home");
const pathExists = require("path-exists").sync;

let args, config;
checkInputArgs();

const log = require("@cycli/log");
const pkg = require("../package.json");
const constant = require("./const");
const dotenv = require("dotenv");

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkArgs();
    checkEnv();
  } catch (e) {
    log.error(e.message);
  }
}

/**
 * 检查环境变量
 */
function checkEnv() {
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");
  if (pathExists(dotenvPath)) {
    config = dotenv.config({
      path: path.resolve(userHome, ".env"),
    });
  }
  config = createDefaultConfig();
  log.verbose("环境变量", process.env.CLI_HOME_PATH);
}

/**
 * 创建默认环境变量
 */
function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, constant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
}

/**
 * 检查入参
 */
function checkInputArgs() {
  const minimist = require("minimist");
  args = minimist(process.argv.slice(2));
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }
  log.level = process.env.LOG_LEVEL;
}

/**
 * 检查用户主目录
 */
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在!"));
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
