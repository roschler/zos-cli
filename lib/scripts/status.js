'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ControllerFor = require('../models/local/ControllerFor');

var _ControllerFor2 = _interopRequireDefault(_ControllerFor);

var _zosLib = require('zos-lib');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let log = new _zosLib.Logger('scripts/status');

exports.default = async function status({ network, txParams = {}, packageFileName = undefined, networkFileName = undefined, logger = undefined }) {
  if (logger) log = logger;
  const appController = (0, _ControllerFor2.default)(packageFileName).onNetwork(network, txParams, networkFileName);
  log.info(`Project status for network ${network}`);

  if (!(await rootInfo(appController))) return;
  if (!(await versionInfo(appController))) return;
  await stdlibInfo(appController);
  await contractsInfo(appController);
  await proxiesInfo(appController);
};

function rootInfo(appController) {
  return appController.isLib() ? libInfo(appController) : appInfo(appController);
}

async function appInfo(appController) {
  if (!appController.appAddress) {
    log.info(`Application is not yet deployed`);
    return false;
  }

  await appController.fetch();
  log.info(`Application is deployed at ${appController.appAddress}`);
  log.info(`- Proxy factory is at ${appController.app.factory.address}`);
  log.info(`- Package is at ${appController.app.package.address}`);
  return true;
}

async function libInfo(appController) {
  if (!appController.packageAddress) {
    log.info(`Library is not yet deployed`);
    return false;
  }

  await appController.fetch();
  log.info(`Library package is deployed at ${appController.packageAddress}`);
  return true;
}

async function versionInfo(appController) {
  const requestedVersion = appController.packageData.version;
  const currentVersion = appController.networkPackage.version;
  if (requestedVersion !== currentVersion) {
    log.info(`- Deployed version ${currentVersion} is out of date (latest is ${requestedVersion})`);
    return false;
  } else {
    log.info(`- Deployed version ${currentVersion} matches the latest one defined`);
    return true;
  }
}

async function contractsInfo(appController) {
  log.info('Application contracts:');
  if (_lodash2.default.isEmpty(appController.packageData.contracts)) {
    log.info(`- No contracts registered`);
    return;
  }

  _lodash2.default.each(appController.packageData.contracts, function (contractName, contractAlias) {
    const isDeployed = appController.isContractDeployed(contractAlias);
    const hasChanged = appController.hasContractChanged(contractAlias);
    const fullName = contractName === contractAlias ? contractAlias : `${contractAlias} (implemented by ${contractName})`;
    if (!isDeployed) {
      log.info(`- ${fullName} is not deployed`);
    } else if (hasChanged) {
      log.info(`- ${fullName} is out of date with respect to the local version`);
    } else {
      log.info(`- ${fullName} is deployed and up to date`);
    }
  });
}

async function stdlibInfo(appController) {
  if (appController.isLib()) return;
  log.info('Standard library:');

  // REFACTOR: Part of this logic is duplicated from NetworkAppController#setStdilb, consider deduplicating it
  const requiredStdlib = appController.packageData.stdlib;
  const requiresStdlib = !_lodash2.default.isEmpty(appController.packageData.stdlib);
  const networkStdlib = appController.networkPackage.stdlib;
  const hasNetworkStdlib = !_lodash2.default.isEmpty(networkStdlib);
  const networkStdlibMatches = hasNetworkStdlib && networkStdlib.name === requiredStdlib.name && networkStdlib.version === requiredStdlib.version;
  const hasCustomDeploy = hasNetworkStdlib && networkStdlib.customDeploy;
  const customDeployMatches = hasCustomDeploy && networkStdlibMatches;

  if (!requiresStdlib) {
    const deployedWarn = hasNetworkStdlib ? `(though ${networkStdlib.name}@${networkStdlib.version} is currently deployed)` : '';
    log.info(`- No stdlib specified for current version ${deployedWarn}`);
    return;
  }

  log.info(`- Stdlib ${requiredStdlib.name}@${requiredStdlib.version} required by current version`);

  if (!hasNetworkStdlib) {
    log.info(`- No stdlib is deployed`);
  } else if (customDeployMatches) {
    log.info(`- Custom deploy of stdlib set at ${networkStdlib.address}`);
  } else if (hasCustomDeploy) {
    log.info(`- Custom deploy of different stdlib ${networkStdlib.name}@${networkStdlib.version} at ${networkStdlib.address}`);
  } else if (networkStdlibMatches) {
    log.info(`- Deployed application is correctly connected to stdlib`);
  } else {
    log.info(`- Deployed application is connected to different stdlib ${networkStdlib.name}@${networkStdlib.version}`);
  }
}

async function proxiesInfo(appController) {
  if (appController.isLib()) return;
  log.info("Deployed proxies:");
  const proxies = appController.networkPackage.proxies;
  if (_lodash2.default.isEmpty(proxies)) {
    log.info('- No proxies created');
    return;
  }

  _lodash2.default.each(proxies, (proxyInfos, alias) => {
    _lodash2.default.each(proxyInfos, ({ address, version }) => {
      log.info(`- ${alias} at ${address} version ${version}`);
    });
  });
}