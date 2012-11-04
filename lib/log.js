
var util = require("util");

function raw() {
  var args = [].slice.call(arguments);
  process.stderr.write( util.format.apply(util.format, args) + '\n');
}

function log(){
  var args = [].slice.call(arguments);
  args.unshift("YALR:");
  raw.apply(null, args);
}

log.d = function(){
  if (log.active) {
    var args = [].slice.call(arguments);
    args.unshift("YALR-debug:");
    raw.apply(null, args);
  }
};


module.exports = log;

