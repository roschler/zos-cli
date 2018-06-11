'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = add;

var _ControllerFor = require('../models/local/ControllerFor');

var _ControllerFor2 = _interopRequireDefault(_ControllerFor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function add({ contractsData, packageFileName = undefined }) {
  if (contractsData.length === 0) throw new Error('At least one contract name must be provided to add.');

  const appController = (0, _ControllerFor2.default)(packageFileName);
  contractsData.forEach(({ name, alias }) => {
    appController.validateImplementation(name);
    appController.add(alias || name, name);
  });
  appController.writePackage();
}