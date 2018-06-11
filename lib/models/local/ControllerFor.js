'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (packageFileName = 'zos.json') {
  if (!_zosLib.FileSystem.exists(packageFileName)) {
    throw Error(`Package file ${packageFileName} not found. Run 'zos init' first to initialize the project.`);
  }

  const packageData = _zosLib.FileSystem.parseJson(packageFileName);
  if (packageData.lib) {
    return new _LocalLibController2.default(packageFileName);
  } else {
    return new _LocalAppController2.default(packageFileName);
  }
};

var _LocalAppController = require('./LocalAppController');

var _LocalAppController2 = _interopRequireDefault(_LocalAppController);

var _LocalLibController = require('./LocalLibController');

var _LocalLibController2 = _interopRequireDefault(_LocalLibController);

var _zosLib = require('zos-lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }