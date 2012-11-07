
var marked = require("marked");
var _ = require("underscore");


function MarkdownOptionParser(optionsHeading, mdText) {
  this.results = [];
  this.mdText = mdText;
  this.optionsHeading = optionsHeading;
}

MarkdownOptionParser.prototype = {

  parse: function(){
    this.startToken = marked.lexer(this.optionsHeading);
    if (this.startToken.length > 1) {
      throw new Error("optionsHeading must have only one item!");
    }
    this.startToken = this.startToken[0];

    // Pick all sub headings of the start heading
    this.optionDepth = this.startToken.depth + 1;
    this.tokens = marked.lexer(this.mdText);
    this.findStart();
  },

  next: function(){
    this.current = _.first(this.tokens);
    this.tokens = _.rest(this.tokens);
    return this.tokens.length > 0;
  },

  // Find where the option list starts
  findStart: function (){
    if (!this.next()) return;

    if (_.isEqual(this.current, this.startToken)) {
      return this.findOption();
    }

    this.findStart();
  },

  // Find an option
  findOption: function (tokens){
    if (!this.next()) return;

    if (this.current.type === "heading" &&
        this.current.depth === this.optionDepth) {
      return this.findDescription(this.current.text.trim());
    }

    this.findOption();
  },

  // Find a description for an option
  findDescription: function (option) {
    if (!this.next()) return;

    if (this.current.type === "paragraph") {
      this.results.push({
        name: option,
        description: this.current.text.trim()
      });

      return this.findOption();
    }

    this.findDescription(option);
  }

};

module.exports = function(optionsStartHeading, mdText){
  var parser = new MarkdownOptionParser(optionsStartHeading, mdText);
  parser.parse();
  return parser.results;
};
