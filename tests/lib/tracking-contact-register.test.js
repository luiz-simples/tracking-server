'use strict';

jest.dontMock("../../lib/is-empty");
var trackingContactPath = '../../lib/tracking-contact';
jest.dontMock(trackingContactPath);

var qPostgresMocked = require('q-postgres');
var TrackingContact = require(trackingContactPath);

describe('tracking-contact', function() {
  describe('#register', function() {
    var tkgContact, contactObj;

    beforeEach(function() {
      contactObj = {
        cid: 'DDKALDSLAJDADJKASHDEJECN',
        hid: 'KJADKJ324234HJH34242HJ3H',
        name: 'Contact Name',
        email: 'contact@email.com',
        message: 'Contact Message'
      };

      var qPostgresMock = qPostgresMocked();
      qPostgresMock.__setMockResponse(function() {
        return {
          rows: [{
            id: 'SDASDASDASADD454S',
            cid: contactObj.cid,
            name: contactObj.name,
            email: contactObj.email,
            message: contactObj.message
          }]
        };
      });

      tkgContact = new TrackingContact(qPostgresMock);
    });

    pit('should register contact', function() {
      return tkgContact.register(contactObj).then(function(contact) {
        expect(contact.id).toBeDefined();
        expect(contact.cid).toBe(contactObj.cid);
        expect(contact.name).toBe(contactObj.name);
        expect(contact.email).toBe(contactObj.email);
        expect(contact.message).toBe(contactObj.message);
      }).catch(function() {
        expect('This function should be resolve').toBe(false);
      });
    });
  });
});
