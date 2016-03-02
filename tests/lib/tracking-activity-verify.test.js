'use strict';

jest.dontMock("../../lib/is-empty");
var trackingActivityPath = '../../lib/tracking-activity';
jest.dontMock(trackingActivityPath);

var TrackingActivity = require(trackingActivityPath);

describe('tracking-activity', function() {
  describe('#verify', function() {
    var tkgActivity, activityObj;

    beforeEach(function() {
      activityObj = {
        cid: 'DDKALDSLAJDADJKASHDEJECN',
        hid: 'DDKALDSLAJDADJKASHDEJECN',
        name: 'view-page',
        reference: '/home'
      };

      tkgActivity = new TrackingActivity();
    });

    pit('should reject activity when empty name', function() {
      delete activityObj.name;

      return tkgActivity.verify(activityObj).then(function() {
        expect('This function should be reject').toBe(false);
      }).catch(function(err) {
        expect(err.message).toBe('Name is not filled');
      });
    });

    pit('should reject activity when empty CID', function() {
      delete activityObj.cid;

      return tkgActivity.verify(activityObj).then(function() {
        expect('This function should be reject').toBe(false);
      }).catch(function(err) {
        expect(err.message).toBe('CID is not filled');
      });
    });

    pit('should reject activity when empty HID', function() {
      delete activityObj.hid;

      return tkgActivity.verify(activityObj).then(function() {
        expect('This function should be reject').toBe(false);
      }).catch(function(err) {
        expect(err.message).toBe('HID is not filled');
      });
    });

    pit('should resolve activity when empty reference', function() {
      delete activityObj.reference;

      return tkgActivity.verify(activityObj).then(function(activity) {
        expect(activity.cid).toBe(activityObj.cid);
        expect(activity.hid).toBe(activityObj.hid);
        expect(activity.name).toBe(activityObj.name);
        expect(activity.reference).toBe(activityObj.reference);
      }).catch(function(err) {
        expect('This function should be resolve').toBe(false);
      });
    });
  });
});
