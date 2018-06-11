'use strict';

var _freeze = require('../scripts/freeze');

var _freeze2 = _interopRequireDefault(_freeze);

var _runWithTruffle = require('../utils/runWithTruffle');

var _runWithTruffle2 = _interopRequireDefault(_runWithTruffle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'freeze';
const description = 'freeze current release version of your stdlib project';

module.exports = {
  signature, description,
  register: function (program) {
    program.command(signature, { noHelp: true }).usage('--network <network> [options]').description(description).option('-f, --from <from>', 'specify transaction sender address').option('-n, --network <network>', 'network to be used').action(async function (options) {
      const { from, network } = options;
      const txParams = from ? { from } : {};
      await (0, _runWithTruffle2.default)(async () => await (0, _freeze2.default)({ network, txParams }), network);
    });
  }
};