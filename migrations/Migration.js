'use strict';

var q         = require('q');
var colog     = require('colog');
var moment    = require('moment');
var findFiles = require('glob');
var sql       = require('sql-query');

var migrationsPath = __dirname.concat('/scripts/**/*.js');

var mgtId      = 'mgtid';
var mgtFile    = 'mgtfile';
var mgtBatch   = 'mgtbatch';
var mgtDtHr    = 'mgtdthr';
var migrations = 'migrations';

module.exports = function(poolPostgres) {
  var sqlQuery = sql.Query();

  var executeMigrations = function(isUpMigration) {
    var batchNumber = 0;
    var getFileObject;

    var searchMigrations = function(lastFile) {
      if (!lastFile) lastFile = {};
      if (!lastFile.hasOwnProperty(mgtBatch)) lastFile[mgtBatch] = 0;
      if (!lastFile.hasOwnProperty(mgtFile))  lastFile[mgtFile] = '';

      var filterMigrations = function(path) {
        var parts = path.split('/');
        var file  = parts[parts.length - 1];

        var isDowngrade = !isUpMigration;
        if (isDowngrade) {
          var fileObject = getFileObject(file);
          if (!fileObject) return false;
          if (fileObject[mgtBatch] < batchNumber) return false;
        }

        return isUpMigration ?
          file > lastFile[mgtFile] :
          file <= lastFile[mgtFile];
      };

      var sortMigrations = function(a, b) {
        if (a < b) return isUpMigration ? -1 :  1;
        if (a > b) return isUpMigration ?  1 : -1;
        return 0;
      };

      var requireMigration = function(path) {
        var parts = path.split('/');
        var migration = require(path);
        migration.file = parts[parts.length - 1];
        return migration;
      };

      return q.Promise(function(resolve, reject) {
        findFiles(migrationsPath, {}, function(err, files) {
          if (err) return reject(err);

          var r = files
            .filter(function(file) {
              return filterMigrations(file);
            })
            .sort(sortMigrations);

          resolve(r.map(requireMigration));
        });
      });
    };

    var createTableMigrations = function(transaction) {
      var sqlCreate = `
         CREATE TABLE IF NOT EXISTS migrations (
           mgtid SERIAL PRIMARY KEY,
           mgtfile VARCHAR(255),
           mgtbatch INTEGER,
           mgtdthr TIMESTAMP
         );
      `;

      return transaction
        .runScript(sqlCreate)
        .then(transaction.commit)
        .then(transaction.openTransaction);
    };

    var selectMigrationsExecuted = function(transaction) {
      var idDesc = mgtId.concat(' DESC');

      var sqlSelect = `
        SELECT mgtfile, mgtbatch
        FROM migrations
        ORDER BY mgtid DESC
        LIMIT 1
      `;

      return transaction.runScript(sqlSelect).then(function(resultSet) {
        return resultSet.rowCount ? resultSet.rows : [];
      });
    };

    return poolPostgres.connect().then(function(connection) {
      return connection.openTransaction().then(createTableMigrations).then(function(transaction) {
        return selectMigrationsExecuted(transaction).then(function(allMigrations) {
          var lastMigration = allMigrations[0];
          if (lastMigration) batchNumber = lastMigration[mgtBatch];
          if (isUpMigration) batchNumber++;

          getFileObject = function(file) {
            return allMigrations.filter(function(migration) {
              return migration[mgtFile] === file;
            })[0];
          };

          return searchMigrations(lastMigration).then(function(resultSet) {
            var executeMigration = function(sqlAction, file) {
              var insertMigration = sqlQuery.insert()
                .into(migrations)
                .set({ mgtFile: file, mgtBatch: batchNumber, mgtDtHr: moment().format('YYYY-MM-DD HH:mm') })
                .build()
                .replace(/`/g, '');

              var deleteMigration = 'DELETE FROM '.concat(migrations, ' WHERE mgtFile = "', file, '"');

              var sql = isUpMigration ? insertMigration : deleteMigration;

              return transaction.runScript(sql).then(function() {
                return sqlAction(transaction);
              }).then(function(sqlExecute) {
                if (!sqlExecute) return;
                return transaction.runScript(sqlExecute);
              }).then(transaction.commit).then(transaction.openTransaction).then(function(newTransaction) {
                transaction = newTransaction;
                colog.warning('SCHEMA-ADJUST:: '.concat(file));
              });
            };

            var beginTrs;

            resultSet.forEach(function(m) {
              var sqlAction = m[isUpMigration ? 'up' : 'down'];

              if (!beginTrs) {
                beginTrs = executeMigration(sqlAction, m.file);
              } else {
                beginTrs = beginTrs.then(function() {
                  return executeMigration(sqlAction, m.file);
                });
              }
            });

            return beginTrs;
          });
        });
      });
    });
  };

  this.migrate = function() {
    var runMigrate = true;
    return executeMigrations(runMigrate);
  };

  this.rollback = function() {
    var runRollback = false;
    return executeMigrations(runRollback);
  };
};
