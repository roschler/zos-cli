'use strict';

var _ErrorHandler = require('../models/ErrorHandler');

var _ErrorHandler2 = _interopRequireDefault(_ErrorHandler);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = function registerErrorHandler(program) {
  process.on('unhandledRejection', reason => {
    throw reason;
  });
  process.on('uncaughtException', error => new _ErrorHandler2.default(error, program).call());

  program.on('command:*', function () {
    console.error(`Invalid command: ${program.args.join(' ')}\nSee --help for a list of available commands.`);
    process.exit(1);
  });
};