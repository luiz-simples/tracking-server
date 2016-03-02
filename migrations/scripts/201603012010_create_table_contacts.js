'use strict';

module.exports = {
  up: function() {
    return `
       CREATE TABLE contacts (
         id SERIAL PRIMARY KEY,
         cid INTEGER,
         name VARCHAR(255),
         email VARCHAR(255),
         message TEXT,
         dthr TIMESTAMP
       );
    `;
  },

  down: function() {
    return 'DROP TABLE contacts';
  }
};
