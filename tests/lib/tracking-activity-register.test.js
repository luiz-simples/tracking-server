'use strict';

jest.dontMock("../../lib/is-empty");
var trackingActivityPath = '../../lib/tracking-activity';
jest.dontMock(trackingActivityPath);

var qPostgresMocked = require('q-postgres');
var TrackingActivity = require(trackingActivityPath);

describe('tracking-activity', function() {
  describe('#register', function() {
    var tkgActivity, activityObj;

    beforeEach(function() {
      activityObj = {
        cid: 'DDKALDSLAJDADJKASHDEJECN',
        hid: 'KJADKJ324234HJH34242HJ3H',
        name: 'view-page',
        reference: '/home'
      };

      var qPostgresMock = qPostgresMocked();
      qPostgresMock.__setMockResponse(function() {
        return {
          rows: [{
            id: 'SDASDASDASADD454S',
            cid: activityObj.cid,
            name: activityObj.name,
            reference: activityObj.reference
          }]
        };
      });

      tkgActivity = new TrackingActivity(qPostgresMock);
    });

    pit('should register activity', function() {
      return tkgActivity.register(activityObj).then(function(activity) {
        expect(activity.id).toBeDefined();
        expect(activity.cid).toBe(activityObj.cid);
        expect(activity.name).toBe(activityObj.name);
        expect(activity.reference).toBe(activityObj.reference);
      }).catch(function() {
        expect('This function should be resolve').toBe(false);
      });
    });
  });
});
