'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocalLibController = require('../models/local/LocalLibController');

var _LocalLibController2 = _interopRequireDefault(_LocalLibController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function freeze({ network, txParams = {}, packageFileName = undefined, networkFileName = undefined }) {
  const appController = new _LocalLibController2.default(packageFileName).onNetwork(network, txParams, networkFileName);
  await appController.freeze();
  appController.writeNetworkPackage();
};