'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ControllerFor = require('../models/local/ControllerFor');

var _ControllerFor2 = _interopRequireDefault(_ControllerFor);

var _stdout = require('../utils/stdout');

var _stdout2 = _interopRequireDefault(_stdout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function bumpVersion({ version, stdlibNameVersion = undefined, installLib = false, packageFileName = undefined }) {
  if (version === undefined || version === '') throw Error('A version name must be provided to initialize a new version.');

  const appController = (0, _ControllerFor2.default)(packageFileName);
  if (stdlibNameVersion && appController.isLib()) {
    throw Error("Cannot link a stdlib for a lib project");
  }

  appController.bumpVersion(version);
  if (!appController.isLib()) {
    await appController.linkStdlib(stdlibNameVersion, installLib);
  }

  appController.writePackage();
  (0, _stdout2.default)(version);
};