/*global process, exports, require, console, setTimeout */

(function () {
  'use strict';

  var
    util = require('util'),
    path = require('path'),
    autoupdatedjson = require('../lib/autoupdatedjson.js')
  ;

  /*
    ======== A Handy Little Nodeunit Reference ========
    https://github.com/caolan/nodeunit

    Test methods:
      test.expect(numAssertions)
      test.done()
    Test assertions:
      test.ok(value, [message])
      test.equal(actual, expected, [message])
      test.notEqual(actual, expected, [message])
      test.deepEqual(actual, expected, [message])
      test.notDeepEqual(actual, expected, [message])
      test.strictEqual(actual, expected, [message])
      test.notStrictEqual(actual, expected, [message])
      test.throws(block, [error], [message])
      test.doesNotThrow(block, [error], [message])
      test.ifError(value)
  */

  exports.bind = {
    setUp: function(done) {
      // setup here
      done();
    },
    'simple': function(test) {
      test.expect(12);

      autoupdatedjson.set('configfile', path.join(process.cwd(), 'test', 'configfile.json'));

      autoupdatedjson.get('configfile', function (configfile) {
        console.log(util.inspect(configfile));

        test.ok(!configfile.error);

        test.equal('string', configfile.data.string);
        test.equal(123.456, configfile.data.number);
        test.equal('a', configfile.data.list[0]);
        test.equal(3, configfile.data.list.length);
        test.equal('bar', configfile.data.obj.foo);
      });

      setTimeout(function () {
        console.log('checking again...');

        autoupdatedjson.get('configfile', function (configfile) {
          console.log(util.inspect(configfile));

          test.ok(!configfile.error);

          test.equal('string', configfile.data.string);
          test.equal(123.456, configfile.data.number);
          test.equal('a', configfile.data.list[0]);
          test.equal(3, configfile.data.list.length);
          test.equal('bar', configfile.data.obj.foo);

          configfile.watcher.close();

          test.done();
        });

      }, 5e3);

    },
  };

}());
