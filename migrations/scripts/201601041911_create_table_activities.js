'use strict';

module.exports = {
  up: function() {
    return `
       CREATE TABLE activities (
         id SERIAL PRIMARY KEY,
         cid INTEGER,
         hid INTEGER,
         name VARCHAR(255),
         reference VARCHAR(255),
         dthr TIMESTAMP
       );
    `;
  },

  down: function() {
    return 'DROP TABLE activities';
  }
};
