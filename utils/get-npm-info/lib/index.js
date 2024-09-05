"use strict";

const axios = require("axios");
const urlJoin = require("url-join");
const semver = require("semver");

function getNpmInfo(npmName, registry) {
  if (!npmName) return null;
  const _registry = registry || getNpmDefaultRegistry();
  const npmInfoUrl = urlJoin(_registry, npmName);
  return axios
    .get(npmInfoUrl)
    .then((response) => {
      if (response.status === 200) {
        return response.data;
      }
      return null;
    })
    .catch((err) => {
      return Promise.reject(err);
    });
}

function getNpmDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? "https://registry.npmjs.org" // 源镜像
    : "https://registry.npmmirror.com"; // 淘宝镜像
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  }
  return [];
}

function getNpmSemverVersions(baseVersion, versions) {
  return versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => semver.gt(b, a));
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const _versions = await getNpmSemverVersions(baseVersion, versions);
  if (_versions && _versions.length > 0) {
    return _versions[0];
  }
  return null;
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion,
};
