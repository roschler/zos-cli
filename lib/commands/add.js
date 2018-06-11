'use strict';

var _push = require('./push');

var _push2 = _interopRequireDefault(_push);

var _add = require('../scripts/add');

var _add2 = _interopRequireDefault(_add);

var _addAll = require('../scripts/add-all');

var _addAll2 = _interopRequireDefault(_addAll);

var _Truffle = require('../models/truffle/Truffle');

var _Truffle2 = _interopRequireDefault(_Truffle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signature = 'add [contractNames...]';
const description = 'add contract to your project. Provide a list of whitespace-separated contract names';
module.exports = {
  signature, description,
  register: function (program) {
    program.command(signature, { noHelp: true }).usage('[contractName1[:contractAlias1] ... contractNameN[:contractAliasN]] [options]').description(description).option('--all', 'add all contracts in your build directory').option('--push <network>', 'push changes to the specified network after adding').option('-f, --from <from>', 'specify the transaction sender address for --push').option('--skip-compile', 'skips contract compilation').action(async function (contractNames, options) {
      if (!options.skipCompile) await _Truffle2.default.compile();
      if (options.all) (0, _addAll2.default)({});else {
        const contractsData = contractNames.map(rawData => {
          let [name, alias] = rawData.split(':');
          return { name, alias: alias || name };
        });
        (0, _add2.default)({ contractsData });
      }
      if (options.push) _push2.default.action({ network: options.push, from: options.from });
    });
  }
};