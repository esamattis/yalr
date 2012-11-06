
var marked = require("marked");
var _ = require("underscore");

var optionsStartHeading = {
  type: 'heading',
  depth: 2,
  text: 'Options'
};

function parseOptions(tokens, options){
  var current = _.first(tokens);
  var rest = _.rest(tokens);
  if (rest.length === 0) return;

  if (_.isEqual(current, optionsStartHeading)) {
    return pickOption(rest, options);
  }
  else {
    return parseOptions(rest, options);
  }
}

function pickOption(tokens, options){
  var current = _.first(tokens);
  var rest = _.rest(tokens);
  if (rest.length === 0) return;

  if (current.type === "heading" && current.depth === 3) {
    // found an option. Now get description for it
    return pickDescription(rest, current.text.trim(), "", options);
  }
  else {
    return pickOption(rest, options);
  }

}

function pickDescription(tokens, currentOption, description, options) {
  var current = _.first(tokens);
  var rest = _.rest(tokens);
  if (rest.length === 0) return;

  if (current.type === "paragraph") {
    description += current.text;
    return pickDescription(rest, currentOption, description, options);
  }
  else {
    // Got full option here!
    options.push({
      name: currentOption,
      description: description
    });
    return pickOption(rest, options);
  }
}


function parseMarkdown(mdText) {
  tokens = marked.lexer(mdText);
  var options = [];
  parseOptions(tokens, options);
  return options;
}

module.exports = parseMarkdown;
