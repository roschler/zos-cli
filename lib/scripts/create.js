'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocalAppController = require('../models/local/LocalAppController');

var _LocalAppController2 = _interopRequireDefault(_LocalAppController);

var _stdout = require('../utils/stdout');

var _stdout2 = _interopRequireDefault(_stdout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function createProxy({ contractAlias, initMethod, initArgs, network, txParams = {}, packageFileName = undefined, networkFileName = undefined, force = false }) {
  if (!contractAlias) throw Error('A contract alias must be provided to create a new proxy.');

  const appController = new _LocalAppController2.default(packageFileName).onNetwork(network, txParams, networkFileName);
  await appController.checkLocalContractDeployed(contractAlias, !force);
  const proxy = await appController.createProxy(contractAlias, initMethod, initArgs);

  appController.writeNetworkPackage();
  (0, _stdout2.default)(proxy.address);
  return proxy;
};