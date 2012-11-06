
var _ = require("underscore");
var log = require("./lib/log");

module.exports = function(userOpts){
  var opts = {};
  userOpts = userOpts || {};

  var yarlFilePath = userOpts.configFile || process.cwd() + "/YALRFile";

  try {
    fileOpts = require(yarlFilePath);
  } catch(err) {
    fileOpts = {};
  }

  // First take options from YARLfile and then from userInput. That's neighter
  // command line switches or an object given using the yalr node.js API.
  _.extend(opts, fileOpts, userOpts);

  log.verbose = opts.verbose;
  log.quiet = opts.quiet;

  var liveUpdate = require("./lib/server")(opts);

  require("./lib/watcher")(opts, function(err, path) {
    if (err) throw err;
    liveUpdate(path);
  });

  return opts;
};




