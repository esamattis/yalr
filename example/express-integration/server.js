
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


app.configure("development", function(){

  // Normally require("yarl")({ ...
  var yalrConfig = require("../../index")({
    port: 1234,
    path: [
      "public",
      "views"
    ]
  });

  app.use(function(req, res, next){
    res.locals.yalrConfig = yalrConfig;
    next();
  });

});


app.get("/", function(req, res){
  res.render("index", {
    layout: false
  });
});


app.listen(8080, function(){
  console.log("Express app listening on http://localhost:8080");
});
