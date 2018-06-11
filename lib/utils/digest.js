'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bytecodeDigest = bytecodeDigest;

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function bytecodeDigest(rawBytecode) {
  const bytecode = rawBytecode.replace(/^0x/, '');
  const buffer = Buffer.from(bytecode, 'hex');
  const hash = _crypto2.default.createHash('sha256');
  return hash.update(buffer).digest('hex');
}