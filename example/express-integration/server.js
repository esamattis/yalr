
var express = require("express");
var engines = require("consolidate");
var _ = require("underscore");

var app = express();


app.configure(function(){
  app.use(express.static(__dirname + "/public"));
  app.engine("html", engines.underscore);
  app.set("views", __dirname + "/views");
  app.set("view engine", "html");
});


var yalrConfig = null;
app.configure("development", function(){

  // Normally require "yarl"
  yalrConfig = require("../../index")({
    port: 1234,
    path: [
      "public",
      "views"
    ]
  });
});


app.get("/", function(req, res){
  res.render("index", {
    yalrConfig: yalrConfig,
    layout: false
  });
});


app.listen(8080, function(){
  console.log("Express app listening on http://localhost:8080");
});
