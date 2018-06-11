'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocalAppController = require('../models/local/LocalAppController');

var _LocalAppController2 = _interopRequireDefault(_LocalAppController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function init({ name, version, stdlibNameVersion = undefined, installLib = false, force = false, packageFileName = undefined }) {
  if (name === undefined) throw Error('A project name must be provided to initialize the project.');

  const appController = new _LocalAppController2.default(packageFileName);
  appController.init(name, version, force);
  await appController.linkStdlib(stdlibNameVersion, installLib);
  appController.writePackage();
};