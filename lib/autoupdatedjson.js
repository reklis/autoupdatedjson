/*global require, exports, setTimeout */

(function () {
  'use strict';

  var
    fs = require('graceful-fs'),
    watch_registry = {},
    data_registry = {}
  ;

  function parse (file_path, cb) {
    var parsed_data;

    try {

      fs.readFile(file_path, function (read_error, file_contents) {
        if (read_error) {
          cb(read_error);
        } else {

          try {

            parsed_data = JSON.parse(file_contents);
            cb(null, parsed_data);

          } catch (ex) {
            cb(ex);
          }

        }
      });

    } catch (ex) {
      cb(ex);
    }
  }

  function updateDataRegistry(key_name, watcher) {
    return function (parse_error, parsed_data) {
      data_registry[key_name] = {
        error: parse_error,
        data: parsed_data,
        meta: {
          last_updated: new Date()
        },
        watcher: watcher
      };
    };
  }

  exports.get = function (key_name, cb) {
    var
      retry_timeout = 1e3,
      reg_entry = data_registry[key_name]
    ;

    if (reg_entry) {
      setTimeout(function () {
        cb(reg_entry);
      });
    } else {
      setTimeout(function () {
        reg_entry = data_registry[key_name] || {};
        cb(reg_entry);
      }, retry_timeout);
    }
  };

  exports.set = function (key_name, file_path) {
    var watcher;

    watcher = fs.watch(file_path);

    watcher.on('change', function (/*event, filename*/) {
      parse(file_path, updateDataRegistry(key_name, watcher));
    });

    watch_registry[key_name] = watcher;

    parse(file_path, updateDataRegistry(key_name, watcher));
  };

}());