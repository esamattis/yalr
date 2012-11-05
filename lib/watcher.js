
var path = require("path");

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

function watchTree(opts, cb) {
  opts = opts || {};
  var sleeping = false;

  _.defaults(opts, {
    path: process.cwd(),
    debounce: 30,
    sleepAfter: 1000,
    match: /.*/,
    ignore: []
  });


  debouncedCb = _.debounce(function(err, filePath){
    cb(err, filePath);

    sleeping = true;

    setTimeout(function() {
      sleeping = false;
    }, opts.sleepAfter);

  }, opts.debounce);

  opts.path = ensureArray(opts.path);
  opts.match = ensureArray(opts.match);
  opts.ignore = ensureArray(opts.ignore);

  watchr.watch({
    paths: opts.path,
    listener: function(eventName, filePath, fileCurrentStat, filePreviousStat) {

      if (opts.ignore.length && matchAny(opts.ignore, filePath)) {
        log.d("Ignoring", filePath);
        return;
      }

      if (matchAny(opts.match, filePath)) {
        if (sleeping) return log.d("Skipping update because sleeping", filePath);
        log.d("Updating", filePath);
        return debouncedCb(null, filePath);
      }

      log.d("No match", filePath);
    }
  });

}

module.exports = watchTree;

if (require.main === module) {
  watchTree({});
}
