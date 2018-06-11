'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Truffle = require('../models/truffle/Truffle');

var _Truffle2 = _interopRequireDefault(_Truffle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function runWithTruffle(script, network, compile = false) {
  const config = _Truffle2.default.config();
  if (!network) throw Error('A network name must be provided to execute the requested action.');
  config.network = network;
  if (compile) await _Truffle2.default.compile(config);
  initTruffle(config).then(script);
};

function initTruffle(config) {
  return new Promise((resolve, reject) => {
    const TruffleEnvironment = require('truffle-core/lib/environment');
    TruffleEnvironment.detect(config, function (error) {
      if (error) throw error;
      const Web3 = require('web3');
      global.web3 = new Web3(config.provider);
      global.artifacts = config.resolver;
      resolve();
    });
  });
}