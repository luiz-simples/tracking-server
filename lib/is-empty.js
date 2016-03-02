'use strict';

module.exports = function(str) {
  return Boolean(String(str || '').trim().length === 0);
};
