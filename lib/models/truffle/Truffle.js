'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _zosLib = require('zos-lib');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const log = new _zosLib.Logger('Truffle');

const Truffle = {
  config() {
    try {
      const TruffleConfig = require('truffle-config');
      return TruffleConfig.detect({ logger: console });
    } catch (error) {
      throw Error('You have to provide a truffle.js file, please remember to initialize your project running "zos init".');
    }
  },

  async compile(config = undefined) {
    log.info("Compiling contracts");
    config = config || this.config();
    config.all = true;
    const TruffleCompile = require('truffle-workflow-compile');

    return new Promise((resolve, reject) => {
      TruffleCompile.compile(config, (error, abstractions, paths) => {
        if (error) reject(error);else resolve(abstractions, paths);
      });
    });
  },

  init(root = process.cwd()) {
    this._initContractsDir(root);
    this._initMigrationsDir(root);
    this._initTruffleConfig(root);
  },

  _initContractsDir(root) {
    const contractsDir = `${root}/contracts`;
    this._initDir(contractsDir);
  },

  _initMigrationsDir(root) {
    const migrationsDir = `${root}/migrations`;
    this._initDir(migrationsDir);
  },

  _initTruffleConfig(root) {
    const truffleFile = `${root}/truffle.js`;
    const truffleConfigFile = `${root}/truffle-config.js`;
    if (!_zosLib.FileSystem.exists(truffleFile) && !_zosLib.FileSystem.exists(truffleConfigFile)) {
      const blueprint = _path2.default.resolve(__dirname, './blueprint.truffle.js');
      _zosLib.FileSystem.copy(blueprint, truffleConfigFile);
    }
  },

  _initDir(dir) {
    if (!_zosLib.FileSystem.exists(dir)) {
      _zosLib.FileSystem.createDir(dir);
      _zosLib.FileSystem.write(`${dir}/.gitkeep`, null);
    }
  }
};

exports.default = Truffle;