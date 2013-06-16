
var _ = require("underscore");
var log = require("./lib/log");
var exec = require("child_process").exec;

module.exports = function(nodejsOpts, cliOpts){

  nodejsOpts = nodejsOpts || {};
  cliOpts = cliOpts || {};
  var opts = {
    // for server
    disableLiveCSS: false,
    port: 35729,

    // watcher
    path: process.cwd(),
    debounce: 0,
    sleepAfter: 1000,
    match: /.*/,
    ignore: [],
    beforeUpdate: function(cb) { cb(); }
  };

  var yarlFilePath = cliOpts.configFile || process.cwd() + "/yalr.js";

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
    fileOpts, // Second apply options from yalr.js
    cliOpts // Last apply options from command line switches
  );

  log.verbose = opts.verbose;
  log.quiet = opts.quiet;

  log.d("Configured with", _.omit(opts, "server", "tag", "_"));

  if (opts.disable) {
    log("Disabled by the 'disable' option!");
    return;
  }

  if (typeof opts.beforeUpdate === "string") {
    var cliCmd = opts.beforeUpdate;
    opts.beforeUpdate = function(cb) {
      exec(cliCmd, function(err, stdout, stderr) {
        process.stderr.write(stderr);
        process.stdout.write(stdout);
        cb(err);
      });
    };
  }

  var liveUpdate = require("./lib/server")(opts);

  require("./lib/watcher")(opts, function(err, path) {
    if (err) throw err;
    opts.beforeUpdate(function(err) {
      if (err) {
        console.error("Before hook failed!", err);
      }
      liveUpdate(path);
    });
  });


  return opts;
};




