'use strict';

module.exports = {
  up: function() {
    return `
       CREATE TABLE contacts (
         id SERIAL PRIMARY KEY,
         cid VARCHAR(350),
         name VARCHAR(350),
         email VARCHAR(350),
         message TEXT,
         dthr TIMESTAMP
       );
    `;
  },

  down: function() {
    return 'DROP TABLE contacts';
  }
};
