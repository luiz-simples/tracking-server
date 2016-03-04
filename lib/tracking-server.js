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

  this.newActivity = function(activityArgs, transaction) {
    var trackingActivity = new TrackingActivity(transaction);

    return trackingActivity
      .verify(activityArgs)
      .then(trackingActivity.register);
  };

  this.newContact = function(contactArgs, transaction) {
    var trackingContact = new TrackingContact(transaction);

    return trackingContact
      .verify(contactArgs)
      .then(trackingContact.register);
  };

  this.getContacts = function(contactArgs, transaction) {
    var trackingContact = new TrackingContact(transaction);
    return trackingContact.list(contactArgs);
  };
}

module.exports = TrackingServer;
