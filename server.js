'use strict';

var path        = require('path');
var http        = require('http');
var colog       = require('colog');
var helmet      = require('helmet');
var express     = require('express');
var HTMLing     = require('htmling');
var qPostgres   = require('q-postgres');
var bodyParser  = require('body-parser');
var compression = require('compression');
var TrackingServer = require('./lib/tracking-server');

var exApp = express();

exApp.use(helmet());
exApp.use(compression());
exApp.use(bodyParser.json({ limit: '2mb' }));
exApp.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, DELETE, GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Custom-Header');
  next();
});

var pathViews = __dirname.concat('/views');
var releasePath = __dirname.concat('/release');
var engineName = 'html';

exApp.use('/release', express.static(releasePath));
exApp.engine(engineName, HTMLing.express(pathViews + '/', {
  watch: false,
  minify: false
}));

exApp.set('views', pathViews);
exApp.set('view engine', engineName);

var env = process.env.NODE_ENV || 'development';
var props = require('./server.json')[env];
var db = props.db;

var poolPostgres = new qPostgres(db.user, db.pass, db.host, db.base, process.env.DATABASE_URL);
var trackingServer = new TrackingServer(poolPostgres);

var runServer = function() {
  exApp.get('/', function(req, res) {
    res.render('site/home');
  });

  exApp.post('/contacts', trackingServer.routeNewContact);
  exApp.post('/activities', trackingServer.routeNewActivity);

  var server = http.createServer(exApp);

  server.on('error', function(err) {
    colog.error(err);
  });

  server.on('listening', function(){
    colog.success('RUNNING SERVER PORT: '.concat(props.port));
  });

  server.listen(process.env.PORT || props.port);
};

trackingServer.prepare().then(runServer).catch(function(err) {
  colog.error(err);
  process.exit();
});
