'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _zosLib = require('zos-lib');

var _StdlibProvider = require('./StdlibProvider');

var _StdlibProvider2 = _interopRequireDefault(_StdlibProvider);

var _StdlibDeployer = require('./StdlibDeployer');

var _StdlibDeployer2 = _interopRequireDefault(_StdlibDeployer);

var _StdlibInstaller = require('./StdlibInstaller');

var _StdlibInstaller2 = _interopRequireDefault(_StdlibInstaller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Stdlib {
  static fetch() {
    return _StdlibProvider2.default.from(...arguments);
  }

  static async deploy() {
    return await _StdlibDeployer2.default.deploy(...arguments);
  }

  constructor(nameAndVersion) {
    this._parseNameVersion(nameAndVersion);
  }

  getName() {
    return this.name;
  }

  getVersion() {
    return this.version;
  }

  contracts() {
    return this.getPackage().contracts;
  }

  contract(alias) {
    return this.contracts()[alias];
  }

  hasContract(alias) {
    if (!this.contracts()) return false;
    return !_lodash2.default.isEmpty(this.contract(alias));
  }

  async install() {
    await _StdlibInstaller2.default.call(this.nameAndVersion);
  }

  getPackage() {
    if (this._packageJson) return this._packageJson;
    const filename = `node_modules/${this.name}/zos.json`;
    this._packageJson = _zosLib.FileSystem.parseJson(filename);
    return this._packageJson;
  }

  _parseNameVersion(nameAndVersion) {
    const [name, version] = nameAndVersion.split('@');
    this.name = name;
    const packageVersion = this.getPackage().version;
    this.version = version || packageVersion;
    this.nameAndVersion = nameAndVersion;
    if (this.version !== packageVersion) throw Error(`Requested stdlib version ${version} does not match stdlib package version ${packageVersion}`);
  }
}
exports.default = Stdlib;