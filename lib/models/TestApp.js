'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocalAppController = require('../models/local/LocalAppController');

var _LocalAppController2 = _interopRequireDefault(_LocalAppController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function testApp(packageFileName, txParams = {}) {
  const appController = new _LocalAppController2.default(packageFileName || 'zos.json', true).onNetwork('test', txParams);
  await appController.deployStdlib();
  await appController.push();
  return appController.app;
};