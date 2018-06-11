"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ControllerFor = require("../models/local/ControllerFor");

var _ControllerFor2 = _interopRequireDefault(_ControllerFor);

var _stdout = require("../utils/stdout");

var _stdout2 = _interopRequireDefault(_stdout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function push({ network, deployStdlib, reupload = false, txParams = {}, packageFileName = undefined, networkFileName = undefined }) {
  const appController = (0, _ControllerFor2.default)(packageFileName).onNetwork(network, txParams, networkFileName);

  try {
    if (deployStdlib && !appController.isLib()) {
      await appController.deployStdlib();
    }
    await appController.push(reupload);
    (0, _stdout2.default)(appController.isLib() ? appController.packageAddress : appController.appAddress);
  } finally {
    appController.writeNetworkPackage();
  }
};