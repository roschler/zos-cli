'use strict';

var _push = require('./push');

var _push2 = _interopRequireDefault(_push);

var _init = require('../scripts/init');

var _init2 = _interopRequireDefault(_init);

var _initLib = require('../scripts/init-lib');

var _initLib2 = _interopRequireDefault(_initLib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'init <project-name> [version]';
const description = `initialize your ZeppelinOS project. Provide a <project-name> and optionally an initial [version] name`;

module.exports = {
  signature, description,
  register: function (program) {
    program.command(signature, { noHelp: true }).usage('<project-name> [version]').description(description).option('--lib', 'create a standard library instead of an application').option('--force', 'overwrite existing project if there is one').option('--link <stdlib>', 'link to a standard library').option('--no-install', 'skip installing stdlib dependencies locally').option('--push <network>', 'push changes to the specified network').option('-f, --from <from>', 'specify transaction sender address for --push').action(async function (name, version, options) {
      const { force } = options;
      if (options.lib) {
        if (options.stdlib) throw Error('Cannot set a stdlib in a library project');
        await (0, _initLib2.default)({ name, version, force });
      } else {
        const { stdlib: stdlibNameVersion, install: installLib } = options;
        await (0, _init2.default)({ name, version, stdlibNameVersion, installLib, force });
      }

      if (options.push) {
        _push2.default.action({ network: options.push, from: options.from });
      }
    });
  }
};