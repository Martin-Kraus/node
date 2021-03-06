'use strict';

const common = require('../common');
const assert = require('assert');
const { exec } = require('child_process');
const fixtures = require('../common/fixtures');

const node = process.execPath;

// test both sets of arguments that check syntax
const syntaxArgs = [
  ['-c'],
  ['--check']
];

const notFoundRE = /^Error: Cannot find module/m;

// test file not found
[
  'syntax/file_not_found.js',
  'syntax/file_not_found'
].forEach(function(file) {
  file = fixtures.path(file);

  // loop each possible option, `-c` or `--check`
  syntaxArgs.forEach(function(args) {
    const _args = args.concat(file);
    const cmd = [node, ..._args].join(' ');
    exec(cmd, common.mustCall((err, stdout, stderr) => {
      // no stdout should be produced
      assert.strictEqual(stdout, '');

      // stderr should have a module not found error message
      assert(notFoundRE.test(stderr), `${notFoundRE} === ${stderr}`);

      assert.strictEqual(err.code, 1);
    }));
  });
});
