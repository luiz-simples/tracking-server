'use strict';

var trackingServerPath = '../../lib/tracking-server';
jest.dontMock(trackingServerPath);
var TrackingServer = require(trackingServerPath);

describe('tracking-server', function() {
  var tkgServer;

  beforeEach(function() {
    tkgServer = new TrackingServer();
  });

  it ('should is defined', function() {
    expect(tkgServer).toBeDefined();
  });
});
