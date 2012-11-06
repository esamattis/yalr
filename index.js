
var _ = require("underscore");
var log = require("./lib/log");

module.exports = function(opts, _extend){

  _extend = _extend || {};

  var yarlFilePath = _extend.config || process.cwd() + "/YALRFile";

  if (!opts) {
    try {
      opts = require(yarlFilePath);
    } catch(err) {
      opts = {};
    }
  }

  _.extend(opts, _extend);

  log.verbose = opts.verbose;
  log.quiet = opts.quiet;

  var liveUpdate = require("./lib/server")(opts);

  require("./lib/watcher")(opts, function(err, path) {
    if (err) throw err;
    liveUpdate(path);
  });

};




