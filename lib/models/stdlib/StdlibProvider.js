'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _zosLib = require('zos-lib');

const StdlibProvider = {
  from(name, version, network) {
    const filename = `node_modules/${name}/zos.${network}.json`;
    const networkInfo = _zosLib.FileSystem.parseJson(filename);
    if (version !== networkInfo.version) throw Error(`Requested stdlib version ${version} does not match stdlib network package version ${networkInfo.version}`);
    return networkInfo.provider.address;
  }
};

exports.default = StdlibProvider;