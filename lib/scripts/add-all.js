"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addAll;

var _ControllerFor = require("../models/local/ControllerFor");

var _ControllerFor2 = _interopRequireDefault(_ControllerFor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addAll({ packageFileName = undefined }) {
  const appController = (0, _ControllerFor2.default)(packageFileName);
  appController.addAll();
  appController.writePackage();
}