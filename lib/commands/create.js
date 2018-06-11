'use strict';

var _create = require('../scripts/create');

var _create2 = _interopRequireDefault(_create);

var _runWithTruffle = require('../utils/runWithTruffle');

var _runWithTruffle2 = _interopRequireDefault(_runWithTruffle);

var _input = require('../utils/input');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'create <alias>';
const description = 'deploys a new upgradeable contract instance. Provide the <alias> you added your contract with';

module.exports = {
  signature, description,
  register: function (program) {
    program.command(signature, { noHelp: true }).usage('<alias> --network <network> [options]').description(description).option('--init [function]', `call function after creating contract. If none is given, 'initialize' will be used`).option('--args <arg1, arg2, ...>', 'provide initialization arguments for your contract if required').option('-f, --from <from>', 'specify transaction sender address').option('-n, --network <network>', 'network to be used').option('--force', 'force creation even if contracts have local modifications').action(async function (contractAlias, options) {
      const { initMethod, initArgs } = (0, _input.parseInit)(options, 'initialize');
      const { from, network, force } = options;
      const txParams = from ? { from } : {};
      await (0, _runWithTruffle2.default)(async () => await (0, _create2.default)({
        contractAlias, initMethod, initArgs, network, txParams, force
      }), network);
    });
  }
};