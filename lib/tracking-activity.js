'use strict';

var q = require('q');
var isEmpty = require('./is-empty');
var sqlQuery = require('sql-query').Query();

function TrackingActivity(database) {
  this.register = function(activity) {
    var sqlNewActivity = sqlQuery.insert()
      .into('activities')
      .set({ cid: activity.cid, hid: activity.hid, name: activity.name, reference: activity.reference || ''})
      .build()
      .concat(' RETURNING id, cid, hid, name, reference')
      .replace(/`/g, '');

    return database.runScript(sqlNewActivity).then(function(res) {
      return res.rows.pop();
    });
  };

  this.verify = function(activity) {
    return q.Promise(function(resolve, reject) {
      if (isEmpty(activity.name)) return reject(new Error('Name is not filled'));
      if (isEmpty(activity.cid))  return reject(new Error('CID is not filled'));
      if (isEmpty(activity.hid))  return reject(new Error('HID is not filled'));

      resolve(activity);
    });
  };
}

module.exports = TrackingActivity;
