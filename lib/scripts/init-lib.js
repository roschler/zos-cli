'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _LocalLibController = require('../models/local/LocalLibController');

var _LocalLibController2 = _interopRequireDefault(_LocalLibController);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = async function initLib({ name, version, force = false, packageFileName = undefined }) {
  if (name === undefined) throw Error('A project name must be provided to initialize the project.');

  const libController = new _LocalLibController2.default(packageFileName);
  libController.init(name, version, force);
  libController.writePackage();
};