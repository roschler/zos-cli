'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocalBaseController = require('./LocalBaseController');

var _LocalBaseController2 = _interopRequireDefault(_LocalBaseController);

var _NetworkLibController = require('../network/NetworkLibController');

var _NetworkLibController2 = _interopRequireDefault(_NetworkLibController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class LocalLibController extends _LocalBaseController2.default {
  constructor(packageFileName) {
    super(packageFileName);
  }

  onNetwork(network, txParams, networkFileName) {
    return new _NetworkLibController2.default(this, network, txParams, networkFileName);
  }

  init(name, version, force = false) {
    super.init(name, version, force);
    this.packageData.lib = true;
  }

  isLib() {
    return true;
  }
}
exports.default = LocalLibController;