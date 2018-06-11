'use strict';

var _push = require('./push');

var _push2 = _interopRequireDefault(_push);

var _bump = require('../scripts/bump');

var _bump2 = _interopRequireDefault(_bump);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'bump <version>';
const description = 'bump your project to a new <version>';
module.exports = {
  signature, description,
  register: function (program) {
    program.command(signature, { noHelp: true }).usage('<version> [options]').description(description).option('--link <stdlib>', 'link to new standard library version').option('--no-install', 'skip installing stdlib dependencies locally').option('--push <network>', 'push changes to the specified network after bumping version').option('-f, --from <from>', 'specify transaction sender address for --push').action(async function (version, options) {
      const { link: stdlibNameVersion, install: installLib } = options;
      await (0, _bump2.default)({ version, stdlibNameVersion, installLib });
      if (options.push) _push2.default.action({ network: options.push, from: options.from });
    });
  }
};