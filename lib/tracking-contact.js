'use strict';

var q = require('q');
var moment = require('moment');
var isEmpty = require('./is-empty');
var sqlQuery = require('sql-query').Query();

function TrackingContact(database) {
  this.register = function(contact) {
    var contactModel = {
      cid: contact.cid,
      hid: contact.hid,
      name: contact.name,
      email: contact.email,
      message: contact.message || '',
      dthr: moment().tz("America/Sao_Paulo").format('YYYY-MM-DD HH:mm:ss')
    };

    var sqlNewContact = sqlQuery.insert()
      .into('contacts')
      .set(contactModel)
      .build()
      .concat(' RETURNING id, dthr')
      .replace(/`/g, '');

    return database.runScript(sqlNewContact).then(function(res) {
      return res.rows.pop();
    });
  };

  this.verify = function(contact) {
    return q.Promise(function(resolve, reject) {
      if (isEmpty(contact.email)) return reject(new Error('Email is not filled'));

      var mathEmail = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
      var isMailInValid = !mathEmail.test(contact.email);
      if (isMailInValid) return reject(new Error('Email is invalid'));

      if (isEmpty(contact.cid)) return reject(new Error('CID is not filled'));
      if (isEmpty(contact.hid)) return reject(new Error('HID is not filled'));

      resolve(contact);
    });
  };

  this.list = function(args) {
    var sqlContacts = sqlQuery.select()
      .from('contacts')
      .select('id', 'cid', 'name', 'email', 'message', 'dthr')
      .where({ hid: args.hid })
      .build()
      .replace(/`/g, '');

    return database.runScript(sqlContacts).then(function(res) {
      return res.rows || [];
    });
  };
}

module.exports = TrackingContact;
