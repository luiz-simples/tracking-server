'use strict';

module.exports = {
  up: function() {
    return 'ALTER TABLE contacts ADD COLUMN hid varchar(350);';
  },

  down: function() {
    return 'ALTER TABLE contacts DROP COLUMN hid;';
  }
};
