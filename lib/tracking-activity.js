'use strict';

var q = require('q');
var moment = require('moment');
var isEmpty = require('./is-empty');
var sqlQuery = require('sql-query').Query();

function TrackingActivity(database) {
  this.register = function(activity) {
    var activityModel = {
      cid: activity.cid,
      hid: activity.hid,
      name: activity.name,
      reference: activity.reference || '',
      dthr: moment().tz("America/Sao_Paulo").format('YYYY-MM-DD HH:mm:ss')
    };

    var sqlNewActivity = sqlQuery.insert()
      .into('activities')
      .set(activityModel)
      .build()
      .concat(' RETURNING id, dthr')
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

  this.list = function(args) {
    var sqlContacts = sqlQuery.select()
      .from('activities')
      .select('id', 'name', 'reference', 'dthr')
      .where({ hid: args.hid, cid: args.cid })
      .build()
      .replace(/`/g, '');

    return database.runScript(sqlContacts).then(function(res) {
      return res.rows || [];
    });
  };
}

module.exports = TrackingActivity;
