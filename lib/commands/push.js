'use strict';

var _push = require('../scripts/push');

var _push2 = _interopRequireDefault(_push);

var _runWithTruffle = require('../utils/runWithTruffle');

var _runWithTruffle2 = _interopRequireDefault(_runWithTruffle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'push';
const description = 'deploys your project to the specified <network>';
function registerPush(program) {
  program.command(signature, { noHelp: true }).description(description).usage('--network <network> [options]').option('-f, --from <from>', 'specify transaction sender address').option('-n, --network <network>', 'network to be used').option('--skip-compile', 'skips contract compilation').option('-d, --deploy-stdlib', 'deploys a copy of the stdlib for development').option('--reset', 'redeploys all contracts (not only the ones that changed)').action(action);
}

async function action(options) {
  const { from, network, skipCompile, deployStdlib, reupload } = options;
  const txParams = from ? { from } : {};
  await (0, _runWithTruffle2.default)(async () => await (0, _push2.default)({ network, deployStdlib, reupload, txParams }), network, !skipCompile);
}

module.exports = { signature, description, register: registerPush, action };