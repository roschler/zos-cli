'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Stdlib = require('../stdlib/Stdlib');

var _Stdlib2 = _interopRequireDefault(_Stdlib);

var _LocalBaseController = require('./LocalBaseController');

var _LocalBaseController2 = _interopRequireDefault(_LocalBaseController);

var _StdlibInstaller = require('../stdlib/StdlibInstaller');

var _StdlibInstaller2 = _interopRequireDefault(_StdlibInstaller);

var _NetworkAppController = require('../network/NetworkAppController');

var _NetworkAppController2 = _interopRequireDefault(_NetworkAppController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LocalAppController extends _LocalBaseController2.default {
  constructor(packageFileName, allowLib = false) {
    super(packageFileName);
    if (this.packageData.lib && !allowLib) {
      throw Error("Cannot create an application controller for a library");
    }
  }

  onNetwork(network, txParams, networkFileName) {
    return new _NetworkAppController2.default(this, network, txParams, networkFileName);
  }

  async linkStdlib(stdlibNameVersion, installLib = false) {
    if (stdlibNameVersion) {
      const stdlib = installLib ? await _StdlibInstaller2.default.call(stdlibNameVersion) : new _Stdlib2.default(stdlibNameVersion);

      this.packageData.stdlib = {
        name: stdlib.getName(),
        version: stdlib.getVersion()
      };
    }
  }

  hasStdlib() {
    return !_lodash2.default.isEmpty(this.packageData.stdlib);
  }

  isLib() {
    return false;
  }
}
exports.default = LocalAppController;