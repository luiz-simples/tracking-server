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
    };

    database.connect().then(function(connection) {
      return connection.openTransaction().then(function(transaction) {
        var trackingActivity = new TrackingActivity(transaction);

        return trackingActivity.verify(activityArgs).then(trackingActivity.register).then(function(activity) {
          return transaction.commit().then(function() {
            res.json(activity);
          });
        });
      }).catch(function(err) {
        colog.error(err);
        res.status(422).json(err.message);
      }).then(connection.end);
    }).catch(connectError).then(next);
  };

  this.routeNewContact = function(req, res, next) {
    var contactArgs = req.body || req.params;

    var connectError = function() {
      var err = 'error connection database';
      colog.error(err);
      res.status(500).send(err);
    };

    database.connect().then(function(connection) {
      return connection.openTransaction().then(function(transaction) {
        var trackingContact = new TrackingContact(transaction);

        return trackingContact.verify(contactArgs).then(trackingContact.register).then(function(contact) {
          return transaction.commit().then(function() {
            res.json(contact);
          });
        }).catch(function(err) {
          colog.error(err);
          res.status(422).json(err.message);
        }).then(connection.end);
      }).catch(connectError).then(next);
    });
  };
}

module.exports = TrackingServer;
