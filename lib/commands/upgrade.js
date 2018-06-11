'use strict';

var _upgrade = require('../scripts/upgrade');

var _upgrade2 = _interopRequireDefault(_upgrade);

var _runWithTruffle = require('../utils/runWithTruffle');

var _runWithTruffle2 = _interopRequireDefault(_runWithTruffle);

var _input = require('../utils/input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'upgrade [alias] [address]';
const description = 'upgrade contract to a new logic. Provide the [alias] you added your contract with, or use --all flag to upgrade all. If no [address] is provided, all instances of that contract class will be upgraded';

module.exports = {
  signature, description,
  register: function (program) {
    program.command(signature, { noHelp: true }).usage('[alias] [address] --network <network> [options]').description(description).option('--init [function]', `call function after upgrading contract. If no name is given, 'initialize' will be used`).option('--args <arg1, arg2, ...>', 'provide initialization arguments for your contract if required').option('--all', 'upgrade all contracts in the application').option('-f, --from <from>', 'specify transaction sender address').option('-n, --network <network>', 'network to be used').option('--force', 'force creation even if contracts have local modifications').action(async function (contractAlias, proxyAddress, options) {
      const { initMethod, initArgs } = (0, _input.parseInit)(options, 'initialize');
      const { from, network, all, force } = options;
      const txParams = from ? { from } : {};
      await (0, _runWithTruffle2.default)(async () => await (0, _upgrade2.default)({
        contractAlias, proxyAddress, initMethod, initArgs,
        all, network, txParams, force
      }), network);
    });
  }
};