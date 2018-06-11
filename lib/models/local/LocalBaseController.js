'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Stdlib = require('../stdlib/Stdlib');

var _Stdlib2 = _interopRequireDefault(_Stdlib);

var _Truffle = require('../truffle/Truffle');

var _Truffle2 = _interopRequireDefault(_Truffle);

var _zosLib = require('zos-lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = new _zosLib.Logger('LocalController');

const DEFAULT_VERSION = '0.1.0';

class LocalBaseController {
  constructor(packageFileName = 'zos.json') {
    this.packageFileName = packageFileName;
  }

  init(name, version, force = false) {
    this.initZosFile(name, version, force);
    _Truffle2.default.init();
  }

  initZosFile(name, version, force = false) {
    if (_zosLib.FileSystem.exists(this.packageFileName) && !force) {
      throw Error(`Cannot overwrite existing file ${this.packageFileName}`);
    }
    if (this.packageData.name && !force) {
      throw Error(`Cannot initialize already initialized package ${this.packageData.name}`);
    }

    this.packageData.name = name;
    this.packageData.version = version || DEFAULT_VERSION;
    this.packageData.contracts = {};
  }

  bumpVersion(version) {
    this.packageData.version = version;
  }

  hasStdlib() {
    return false;
  }

  add(contractAlias, contractName) {
    // We are logging an error instead of throwing because a contract may have an empty constructor, 
    // which is fine, but as long as it is declared we will be picking it up
    const path = `${process.cwd()}/build/contracts/${contractName}.json`;
    if (this.hasConstructor(path)) {
      log.error(`Contract ${contractName} has an explicit constructor. Move it to an initializer function to use it with ZeppelinOS.`);
    }

    this.packageData.contracts[contractAlias] = contractName;
  }

  addAll() {
    const folder = `${process.cwd()}/build/contracts`;
    _zosLib.FileSystem.readDir(folder).forEach(file => {
      const path = `${folder}/${file}`;
      if (this.hasBytecode(path)) {
        const contractData = _zosLib.FileSystem.parseJson(path);
        const contractName = contractData.contractName;
        this.add(contractName, contractName);
      }
    });
  }

  validateImplementation(contractName) {
    // We are manually checking the build file instead of delegating to Contracts,
    // as Contracts requires initializing the entire truffle stack.
    const folder = `${process.cwd()}/build/contracts`;
    const path = `${folder}/${contractName}.json`;
    if (!_zosLib.FileSystem.exists(path)) {
      throw Error(`Contract ${contractName} not found in folder ${folder}`);
    }
    if (!this.hasBytecode(path)) {
      throw Error(`Contract ${contractName} is abstract and cannot be deployed.`);
    }
  }

  hasBytecode(contractDataPath) {
    if (!_zosLib.FileSystem.exists(contractDataPath)) return false;
    const bytecode = _zosLib.FileSystem.parseJson(contractDataPath).bytecode;
    return bytecode && bytecode !== "0x";
  }

  hasConstructor(contractDataPath) {
    if (!_zosLib.FileSystem.exists(contractDataPath)) return false;
    const abi = _zosLib.FileSystem.parseJson(contractDataPath).abi;
    return !!abi.find(fn => fn.type === "constructor");
  }

  get packageData() {
    if (!this._package) {
      this._package = _zosLib.FileSystem.parseJsonIfExists(this.packageFileName) || {};
    }
    return this._package;
  }

  getContractClass(contractAlias) {
    const contractName = this.packageData.contracts[contractAlias];
    if (contractName) {
      return _zosLib.Contracts.getFromLocal(contractName);
    } else if (this.hasStdlib()) {
      const stdlibName = this.packageData.stdlib.name;
      const contractName = new _Stdlib2.default(stdlibName).contract(contractAlias);
      return _zosLib.Contracts.getFromNodeModules(stdlibName, contractName);
    } else {
      throw Error(`Could not find ${contractAlias} contract in zOS project. Please provide one or make sure to set a stdlib that provides one.`);
    }
  }

  writePackage() {
    _zosLib.FileSystem.writeJson(this.packageFileName, this.packageData);
    log.info(`Successfully written ${this.packageFileName}`);
  }
}
exports.default = LocalBaseController;