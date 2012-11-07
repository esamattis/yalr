
var _ = require("underscore");
var log = require("./lib/log");

module.exports = function(nodejsOpts, cliOpts){

  nodejsOpts = nodejsOpts || {};
  cliOpts = cliOpts || {};
  var opts = {
    // for server
    disableLiveCSS: false,
    port: 35729,

    // watcher
    path: process.cwd(),
    debounce: 30,
    sleepAfter: 1000,
    match: /.*/,
    ignore: []
  };

  var yarlFilePath = cliOpts.configFile || process.cwd() + "/YALRFile";

  var fileOpts;
  try {
    fileOpts = require(yarlFilePath);
  } catch(err) {
    fileOpts = {};
  }

  // Option preference order. Last one takes an effectj
  _.extend(
    opts, // Start with defaults
    nodejsOpts, // First apply options given from node.js api
    fileOpts, // Second apply options from YALRFile
    cliOpts // Last apply options from command line switches
  );

  log.verbose = opts.verbose;
  log.quiet = opts.quiet;

  var liveUpdate = require("./lib/server")(opts);

  require("./lib/watcher")(opts, function(err, path) {
    if (err) throw err;
    liveUpdate(path);
  });

  return opts;
};




