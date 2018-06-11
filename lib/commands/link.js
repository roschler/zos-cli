'use strict';

var _push = require('./push');

var _push2 = _interopRequireDefault(_push);

var _link = require('../scripts/link');

var _link2 = _interopRequireDefault(_link);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'link <stdlib>';
const description = 'links project with a standard library located in the <stdlib> npm package';
module.exports = {
  signature, description,
  register: function (program) {
    program.command(signature, { noHelp: true }).usage('<stdlib> [options]').description(description).option('--no-install', 'skip installing stdlib dependencies locally').option('--push <network>', 'push changes to the specified network').option('-f, --from <from>', 'specify transaction sender address for --push').action(async function (stdlibNameVersion, options) {
      const installLib = options.install;
      await (0, _link2.default)({ stdlibNameVersion, installLib });
      if (options.push) _push2.default.action({ network: options.push, from: options.from });
    });
  }
};