
var path = require("path");
var domain = require("domain");

var watchr = require('watchr');
var _ = require("underscore");
var minimatch = require("minimatch");

var log = require("./log");


function ensureArray(ob) {
  return Array.isArray(ob) ? ob : [ob];
}

function matchAny(matchers, target) {
  var matcher;
  for (var i = 0; i < matchers.length; i += 1) {
    matcher = matchers[i];

    // Use glob matching if matcher is a string
    if (typeof(matcher) === "string") {
      if (minimatch(path.basename(target), matcher)) return true;
      continue;
    }

    // Otherwise asume regexp
    if (matcher.exec(target)) return true;

  }
  return false;
}

function watchTree(opts, sendUpdate_) {
  opts = opts || {};
  var sleeping = false;

  function updateDone() {
    setTimeout(function() {
      sleeping = false;
    }, opts.sleepAfter);
  }

  sendUpdate = _.debounce(function(err, filePath){
    sleeping = true;
    sendUpdate_(err, filePath, updateDone);
  }, opts.debounce);

  opts.path = ensureArray(opts.path);
  opts.match = ensureArray(opts.match);
  opts.ignore = ensureArray(opts.ignore);

  function watchrListener(eventName, filePath, fileCurrentStat, filePreviousStat) {

    if (opts.ignore.length && matchAny(opts.ignore, filePath)) {
      log.d("Ignoring", filePath);
      return;
    }

    if (matchAny(opts.match, filePath)) {
      if (sleeping) return log.d("Skipping update because sleeping", filePath);
      log.d("Updating", filePath);
      return sendUpdate(null, filePath);
    }

    log.d("No match", filePath);
  }

  var d = domain.create();
  d.on("error", function(err){
    log("ERROR", "The watchr module threw an unhandled exception on us!", err);
    log("ERROR", "stack", err.stack);
    log("ERROR", "You might want to restart...");
  });

  d.run(function() {
    process.nextTick(function() {
      watchr.watch({
        paths: opts.path,
        listener: watchrListener
      });
    });
  });

}

module.exports = watchTree;

if (require.main === module) {
  watchTree({});
}
