'use strict';

jest.dontMock("../../lib/is-empty");
var trackingContactPath = '../../lib/tracking-contact';
jest.dontMock(trackingContactPath);

var TrackingContact = require(trackingContactPath);

describe('tracking-contact', function() {
  describe('#verify', function() {
    var tkgContact, contactObj;

    beforeEach(function() {
      contactObj = {
        cid: 'DDKALDSLAJDADJKASHDEJECN',
        hid: 'KJADKJ324234HJH34242HJ3H',
        name: 'Contact Name',
        email: 'contact@email.com',
        message: 'Contact Message'
      };

      tkgContact = new TrackingContact();
    });

    pit('should reject contact when empty email', function() {
      delete contactObj.email;

      return tkgContact.verify(contactObj).then(function() {
        expect('This function should be reject').toBe(false);
      }).catch(function(err) {
        expect(err.message).toBe('Email is not filled');
      });
    });

    pit('should reject contact when invalid email', function() {
      contactObj.email = 'invalid@';

      return tkgContact.verify(contactObj).then(function() {
        expect('This function should be reject').toBe(false);
      }).catch(function(err) {
        expect(err.message).toBe('Email is invalid');
      });
    });

    pit('should reject contact when empty CID', function() {
      delete contactObj.cid;

      return tkgContact.verify(contactObj).then(function() {
        expect('This function should be reject').toBe(false);
      }).catch(function(err) {
        expect(err.message).toBe('CID is not filled');
      });
    });

    pit('should reject contact when empty HID', function() {
      delete contactObj.hid;

      return tkgContact.verify(contactObj).then(function() {
        expect('This function should be reject').toBe(false);
      }).catch(function(err) {
        expect(err.message).toBe('HID is not filled');
      });
    });

    pit('should resolve contact when empty message', function() {
      delete contactObj.message;

      return tkgContact.verify(contactObj).then(function(contact) {
        expect(contact.cid).toBe(contactObj.cid);
        expect(contact.hid).toBe(contactObj.hid);
        expect(contact.name).toBe(contactObj.name);
        expect(contact.email).toBe(contactObj.email);
        expect(contact.message).toBe(contactObj.message);
      }).catch(function(err) {
        expect('This function should be resolve').toBe(false);
      });
    });
  });
});
