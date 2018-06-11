'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zosLib = require('zos-lib');

var _NetworkBaseController = require('./NetworkBaseController');

var _NetworkBaseController2 = _interopRequireDefault(_NetworkBaseController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class NetworkLibController extends _NetworkBaseController2.default {
  constructor(appController, network, txParams, networkFileName) {
    super(...arguments);
  }

  get defaultNetworkPackage() {
    return { contracts: {}, lib: true, frozen: false };
  }

  isDeployed() {
    return !!this.packageAddress;
  }

  async deploy() {
    this.package = await _zosLib.Package.deploy(this.txParams);
    this.networkPackage.package = { address: this.package.address() };
  }

  async fetch() {
    const address = this.packageAddress;
    if (!address) throw Error('Your application must be deployed to interact with it.');
    this.package = await _zosLib.Package.fetch(address, this.txParams);
  }

  setImplementation(contractClass, contractAlias) {
    return this.package.setImplementation(this.networkPackage.version, contractClass, contractAlias);
  }

  newVersion(versionName) {
    this.networkPackage.frozen = false;
    return this.package.newVersion(versionName);
  }

  async freeze() {
    await this.fetch();
    await this.package.freeze(this.networkPackage.version);
    this.networkPackage.frozen = true;
  }

  async uploadContracts(reupload) {
    if (this.networkPackage.frozen) {
      throw Error('Cannot upload contracts for a frozen release. Run zos bump to create a new version first.');
    }
    await super.uploadContracts(reupload);
  }
}
exports.default = NetworkLibController;