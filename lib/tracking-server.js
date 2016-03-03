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

        return trackingActivity.verify(activityArgs).then(trackingActivity.register).then(function(activity) {
          return transaction.commit().then(function() {
            res.status(202).json(activity);
            next();
          });
        }).catch(function(err) {
          return transaction.rollback().then(function() {
            colog.error(err);
            res.status(422).json(err.message);
            next();
          });
        });
      });
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
      return connection.openTransaction().then(function(transaction) {
        var trackingContact = new TrackingContact(transaction);

        return trackingContact.verify(contactArgs).then(trackingContact.register).then(function(contact) {
          return transaction.commit().then(function() {
            res.status(202).json(contact);
            next();
          });
        }).catch(function(err) {
          return transaction.rollback().then(function() {
            colog.error(err);
            res.status(422).json(err.message);
            next();
          });
        });
      });
    }).catch(connectError);
  };
}

module.exports = TrackingServer;
