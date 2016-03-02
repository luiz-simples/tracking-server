'use strict';

var q = require('q');
var isEmpty = require('./is-empty');
var sqlQuery = require('sql-query').Query();

function TrackingContact(database) {
  this.register = function(contact) {
    var sqlNewContact = sqlQuery.insert()
      .into('contacts')
      .set({ cid: contact.cid, hid: contact.hid, name: contact.name, email: contact.email, message: contact.message || ''})
      .build()
      .concat(' RETURNING id, cid, hid, name, email, message')
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
}

module.exports = TrackingContact;
