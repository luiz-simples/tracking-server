'use strict';

module.exports = {
  up: function() {
    return `
       CREATE TABLE activities (
         id SERIAL PRIMARY KEY,
         cid VARCHAR(350),
         hid VARCHAR(350),
         name VARCHAR(350),
         reference VARCHAR(350),
         dthr TIMESTAMP
       );
    `;
  },

  down: function() {
    return 'DROP TABLE activities';
  }
};
