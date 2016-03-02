'use strict';

var q = require('q');

var mockError    = null;
var mockResponse = null;

function responseScript() {
  return q.Promise(function(resolve, reject) {
    if (mockError) {
      return reject(new Error(mockError()));
    }

    resolve(mockResponse ? mockResponse() : null);
  });
}

var qPostgres = {
  commit: jest.genMockFunction().mockImplementation(getPostgres),
  connect: jest.genMockFunction().mockImplementation(getPostgres),
  rollback: jest.genMockFunction().mockImplementation(getPostgres),
  runScript: jest.genMockFunction().mockImplementation(responseScript),
  openTransaction: jest.genMockFunction().mockImplementation(getPostgres)
};

function getPostgres() {
  return q.Promise(function(resolve) {
    resolve(qPostgres);
  });
}

var qPostgresMock = jest.genMockFunction().mockImplementation(function() {
  return qPostgres;
});

qPostgres.__setMockError = function(callErr) {
  mockError = callErr;
};

qPostgres.__setMockResponse = function(callRes) {
  mockResponse = callRes;
};

module.exports = qPostgresMock;
