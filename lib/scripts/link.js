'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ControllerFor = require('../models/local/ControllerFor');

var _ControllerFor2 = _interopRequireDefault(_ControllerFor);

var _stdout = require('../utils/stdout');

var _stdout2 = _interopRequireDefault(_stdout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function linkStdlib({ stdlibNameVersion, installLib = false, packageFileName = undefined }) {
  if (!stdlibNameVersion) {
    throw Error('The stdlib name and version to be linked must be provided.');
  }
  const appController = (0, _ControllerFor2.default)(packageFileName);
  if (appController.isLib()) {
    throw Error("Libraries cannot use a stdlib");
  }
  await appController.linkStdlib(stdlibNameVersion, installLib);
  appController.writePackage();
  (0, _stdout2.default)(stdlibNameVersion);
};