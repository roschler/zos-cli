'use strict';

var _status = require('../scripts/status');

var _status2 = _interopRequireDefault(_status);

var _runWithTruffle = require('../utils/runWithTruffle');

var _runWithTruffle2 = _interopRequireDefault(_runWithTruffle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'status';
const description = 'print information about the deployment of your app in a specific network';

module.exports = {
  signature, description,
  register: function (program) {
    program.command(signature, { noHelp: true }).description(description).usage('--network <network>').option('-n, --network <network>', 'network to be used').option('-f, --from <from>', 'specify transaction sender address').action(async function (options) {
      const { from, network } = options;
      const txParams = from ? { from } : {};
      await (0, _runWithTruffle2.default)(async () => await (0, _status2.default)({ txParams, network }), network);
    });
  }
};