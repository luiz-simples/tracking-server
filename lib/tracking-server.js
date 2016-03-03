'use strict';

var colog = require('colog');
var Migrations = require('../migrations/Migration');
var TrackingContact = require('./tracking-contact');
var TrackingActivity = require('./tracking-activity');

function TrackingServer(database) {
  this.prepare = function() {
    var migrations = new Migrations(database);
    return migrations.migrate();
  };

  this.routeNewActivity = function(req, res, next) {
    var activityArgs = req.body || req.params;

    var connectError = function() {
      var err = 'error connection database';
      colog.error(err);
      res.status(500).send(err);
      next();
    };

    database.connect().then(function(connection) {
      return connection.openTransaction().then(function(transaction) {
        var trackingActivity = new TrackingActivity(transaction);

        trackingActivity.verify(activityArgs).then(function(activity) {
          trackingActivity.register(activity).then(function(activityPersisted) {
            transaction.commit().then(function() {
              res.status(202).json(activityPersisted);
            }).then(next).catch(next);
          }).catch(function(err) {
            transaction.rollback().then(function() {
              colog.error(err);
              res.status(422).json(err.message);
            }).then(next).catch(next);
          });
        }).catch(function(err) {
          transaction.rollback().then(function() {
            colog.error(err);
            res.status(422).json(err.message);
          }).then(next).catch(next);
        });
      }).catch(connectError);
    }).catch(connectError);
  };

  this.routeNewContact = function(req, res, next) {
    var contactArgs = req.body || req.params;

    var connectError = function() {
      var err = 'error connection database';
      colog.error(err);
      res.status(500).send(err);
      next();
    };

    database.connect().then(function(connection) {
      connection.openTransaction().then(function(transaction) {
        var trackingContact = new TrackingContact(transaction);

        trackingContact.verify(contactArgs).then(function(contact) {
          trackingContact.register(contact).then(function(contactPersisted) {
            transaction.commit().then(function() {
              res.status(202).json(contactPersisted);
            }).then(next).catch(next);
          }).catch(function(err) {
            transaction.rollback().then(function() {
              colog.error(err);
              res.status(422).json(err.message);
            }).then(next).catch(next);
          });
        }).catch(function(err) {
          transaction.rollback().then(function() {
            colog.error(err);
            res.status(422).json(err.message);
          }).then(next).catch(next);
        });
      }).catch(connectError);
    }).catch(connectError);
  };
}

module.exports = TrackingServer;
