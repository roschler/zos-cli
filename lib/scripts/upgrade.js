'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocalAppController = require('../models/local/LocalAppController');

var _LocalAppController2 = _interopRequireDefault(_LocalAppController);

var _stdout = require('../utils/stdout');

var _stdout2 = _interopRequireDefault(_stdout);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function upgradeProxy({ contractAlias, proxyAddress, initMethod, initArgs, all, network, txParams = {}, packageFileName = undefined, networkFileName = undefined, force = false }) {
  if (!contractAlias && !all) {
    throw Error('The contract name to upgrade must be provided, or explicit upgrading all proxies in the application.');
  }

  const appController = new _LocalAppController2.default(packageFileName).onNetwork(network, txParams, networkFileName);

  try {
    await appController.checkLocalContractsDeployed(!force);
    const proxies = await appController.upgradeProxies(contractAlias, proxyAddress, initMethod, initArgs);
    (0, _lodash2.default)(proxies).values().forEach(proxies => proxies.forEach(proxy => (0, _stdout2.default)(proxy.address)));
  } finally {
    appController.writeNetworkPackage();
  }
};