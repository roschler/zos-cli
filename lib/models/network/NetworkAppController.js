'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _Stdlib = require('../stdlib/Stdlib');

var _Stdlib2 = _interopRequireDefault(_Stdlib);

var _zosLib = require('zos-lib');

var _NetworkBaseController = require('./NetworkBaseController');

var _NetworkBaseController2 = _interopRequireDefault(_NetworkBaseController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = new _zosLib.Logger('NetworkAppController');

class NetworkAppController extends _NetworkBaseController2.default {
  constructor(appController, network, txParams, networkFileName) {
    super(...arguments);
  }

  get appAddress() {
    return this.networkPackage.app && this.networkPackage.app.address;
  }

  get defaultNetworkPackage() {
    return { contracts: {}, proxies: {} };
  }

  isDeployed() {
    return !!this.appAddress;
  }

  async deploy() {
    this.app = await _zosLib.App.deploy(this.packageData.version, this.txParams);
    this.networkPackage.app = { address: this.app.address() };
    this.networkPackage.version = this.packageData.version;
    this.networkPackage.package = { address: this.app.package.address };
    this.networkPackage.provider = { address: this.app.currentDirectory().address };
  }

  async fetch() {
    const address = this.appAddress;
    if (!address) throw Error('Your application must be deployed to interact with it.');
    this.app = await _zosLib.App.fetch(address, this.txParams);
  }

  async push(reupload = false) {
    await super.push(reupload);
    await this.linkStdlib();
  }

  async deployStdlib() {
    if (!this.localController.hasStdlib()) {
      delete this.networkPackage['stdlib'];
      return;
    }
    const stdlibAddress = await _Stdlib2.default.deploy(this.packageData.stdlib.name, this.txParams);
    this.networkPackage.stdlib = _extends({ address: stdlibAddress, customDeploy: true }, this.packageData.stdlib);
  }

  async newVersion(versionName) {
    // REFACTOR: App should return the newly created directory upon newVersion
    await this.app.newVersion(versionName);
    return this.app.currentDirectory();
  }

  setImplementation(contractClass, contractAlias) {
    return this.app.setImplementation(contractClass, contractAlias);
  }

  async createProxy(contractAlias, initMethod, initArgs) {
    await this.fetch();

    const contractClass = this.localController.getContractClass(contractAlias);
    this.checkInitialization(contractClass, initMethod, initArgs);
    const proxyInstance = await this.app.createProxy(contractClass, contractAlias, initMethod, initArgs);
    const implementationAddress = await this.app.getImplementation(contractAlias);

    const proxyInfo = {
      address: proxyInstance.address,
      version: this.app.version,
      implementation: implementationAddress
    };

    const proxies = this.networkPackage.proxies;
    if (!proxies[contractAlias]) proxies[contractAlias] = [];
    proxies[contractAlias].push(proxyInfo);
    return proxyInstance;
  }

  checkInitialization(contractClass, calledInitMethod, calledInitArgs) {
    // If there is an initializer called, assume it's ok
    if (calledInitMethod) return;

    // Otherwise, warn the user to invoke it
    const initializeMethod = contractClass.abi.find(fn => fn.type === 'function' && fn.name === 'initialize');
    if (!initializeMethod) return;
    log.error(`Possible initialization method 'initialize' found in contract. Make sure you initialize your instance.`);
  }

  async upgradeProxies(contractAlias, proxyAddress, initMethod, initArgs) {
    const proxyInfos = this.getProxies(contractAlias, proxyAddress);
    if (_lodash2.default.isEmpty(proxyInfos) || contractAlias && _lodash2.default.isEmpty(proxyInfos[contractAlias])) {
      log.info("No proxies to upgrade were found");
      return;
    }

    await this.fetch();
    const newVersion = this.app.version;
    const failures = [];
    await Promise.all(_lodash2.default.flatMap(proxyInfos, (contractProxyInfos, contractAlias) => {
      const contractClass = this.localController.getContractClass(contractAlias);
      this.checkUpgrade(contractClass, initMethod, initArgs);
      return _lodash2.default.map(contractProxyInfos, async proxyInfo => {
        try {
          const currentImplementation = await this.app.getProxyImplementation(proxyInfo.address);
          const contractImplementation = await this.app.getImplementation(contractAlias);
          if (currentImplementation !== contractImplementation) {
            await this.app.upgradeProxy(proxyInfo.address, contractClass, contractAlias, initMethod, initArgs);
            proxyInfo.implementation = await this.app.getImplementation(contractAlias);
          } else {
            log.info(`Contract ${contractAlias} at ${proxyInfo.address} is up to date.`);
            proxyInfo.implementation = currentImplementation;
          }
          proxyInfo.version = newVersion;
        } catch (error) {
          failures.push({ proxyInfo, contractAlias, error });
        }
      });
    }));

    if (!_lodash2.default.isEmpty(failures)) {
      const message = failures.map(failure => `Proxy ${failure.contractAlias} at ${failure.proxyInfo.address} failed to upgrade with ${failure.error.message}`).join('\n');
      throw Error(message);
    }

    return proxyInfos;
  }

  /**
   * Returns all proxies, optionally filtered by a contract alias and a proxy address
   * @param {*} contractAlias 
   * @param {*} proxyAddress 
   * @returns an object with contract aliases as keys, and arrays of Proxy (address, version) as values
   */
  getProxies(contractAlias, proxyAddress) {
    if (!contractAlias) {
      if (proxyAddress) throw Error('Must set contract alias if filtering by proxy address.');
      return this.networkPackage.proxies;
    }

    return {
      [contractAlias]: _lodash2.default.filter(this.networkPackage.proxies[contractAlias], proxy => !proxyAddress || proxy.address === proxyAddress)
    };
  }

  checkUpgrade(contractClass, calledMigrateMethod, calledMigrateArgs) {
    // If there is a migration called, assume it's ok
    if (calledMigrateMethod) return;

    // Otherwise, warn the user to invoke it
    const migrateMethod = contractClass.abi.find(fn => fn.type === 'function' && fn.name === 'migrate');
    if (!migrateMethod) return;
    log.error(`Possible migration method 'migrate' found in contract ${contractClass.contractName}. Remember running the migration after deploying it.`);
  }

  async linkStdlib() {
    if (!this.localController.hasStdlib()) {
      await this.app.setStdlib();
      delete this.networkPackage['stdlib'];
      return;
    }

    const networkStdlib = this.networkPackage.stdlib;
    const hasNetworkStdlib = !_lodash2.default.isEmpty(networkStdlib);
    const hasCustomDeploy = hasNetworkStdlib && networkStdlib.customDeploy;
    const customDeployMatches = hasCustomDeploy && this.areSameStdlib(networkStdlib, this.packageData.stdlib);

    if (customDeployMatches) {
      log.info(`Using existing custom deployment of stdlib at ${networkStdlib.address}`);
      await this.app.setStdlib(networkStdlib.address);
      return;
    }

    const stdlibName = this.packageData.stdlib.name;
    log.info(`Connecting to public deployment of ${stdlibName} in ${this.network}`);
    const stdlibAddress = _Stdlib2.default.fetch(stdlibName, this.packageData.stdlib.version, this.network);
    const currentStdlibAddress = await this.app.currentStdlib();
    if (stdlibAddress !== currentStdlibAddress) {
      await this.app.setStdlib(stdlibAddress);
      this.networkPackage.stdlib = _extends({ address: stdlibAddress }, this.packageData.stdlib);
    } else log.info(`Current application is already linked to stdlib ${stdlibName} at ${stdlibAddress} in ${this.network}`);
  }

  areSameStdlib(aStdlib, anotherStdlib) {
    return aStdlib.name === anotherStdlib.name && aStdlib.version === anotherStdlib.version;
  }

  isStdlibContract(contractAlias) {
    if (!this.localController.hasStdlib()) return false;
    const stdlib = new _Stdlib2.default(this.packageData.stdlib.name);
    return stdlib.hasContract(contractAlias);
  }

  isContractDefined(contractAlias) {
    return super.isContractDefined(contractAlias) || this.isStdlibContract(contractAlias);
  }

}
exports.default = NetworkAppController;