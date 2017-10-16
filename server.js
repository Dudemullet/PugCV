// Module Dependencies
var express = require('express'),
  app = express();
  http = require('http'),
  path = require('path'),
  fs = require("fs"),
  dir  = require('node-dir');

module.exports = function(conf){
  app.use(require('connect-livereload')());
  app.use(express.static(conf.dir));
  app.set("views", conf.dir)
  app.engine('jade', require('jade').__express);
  app.listen(conf.port);
  console.log("Server started in http://localhost:" + conf.port);
}
