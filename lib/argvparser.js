
var fs = require("fs");

var optimist = require("optimist");
var parseMarkdown = require("./md2json");


module.exports = function(argv){
  var op = optimist(argv);
  var mdText = fs.readFileSync(__dirname + "/../README.md").toString();
  var options = parseMarkdown("## Options", mdText);

  op.usage("yalr [options]");
  options.forEach(function(item) {
    op.describe(item.name, item.description.trim());
  });

  op.describe("version", "Display YALR version");

  if (op.argv.help) {
    process.stderr.write(op.help() + "\n");
    process.exit(0);
  }

  if (op.argv.version) {
    process.stderr.write(
      require(__dirname + "/../package.json").version + "\n"
    );
    process.exit(0);

  }

  return op.argv;

};

if (require.main === module) {
  console.log("END otions", module.exports(["--help"]));
}
