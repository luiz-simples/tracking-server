'use strict';

var http        = require('http');
var colog       = require('colog');
var helmet      = require('helmet');
var express     = require('express')();
var qPostgres   = require('q-postgres');
var bodyParser  = require('body-parser');
var compression = require('compression');
var TrackingServer = require('./lib/tracking-server');

express.use(helmet());
express.use(compression());
express.use(bodyParser.json({ limit: '2mb' }));
express.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, DELETE, GET, POST');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Custom-Header');
  next();
});

var env = process.env.NODE_ENV || 'development';
var props = require('./server.json')[env];
var db = props.db;

var poolPostgres = new qPostgres(db.user, db.pass, db.host, db.base, process.env.DATABASE_URL);
var trackingServer = new TrackingServer(poolPostgres);

var runServer = function() {
  express.post('/contacts', trackingServer.routeNewContact);
  express.post('/activities', trackingServer.routeNewActivity);

  var server = http.createServer(express);

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
