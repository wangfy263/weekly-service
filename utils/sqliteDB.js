var fs = require('fs');
var sqlite3 = require('sqlite3').verbose();

var DB = DB || {};

var filename = "week.db";

DB.SqliteDB = function () {
  DB.db = new sqlite3.Database(filename);

  DB.exist = fs.existsSync(filename);
  if (!DB.exist) {
    console.log("Creating db file!");
    fs.openSync(filename, 'w');
  };
  
};

DB.printErrorInfo = function (err) {
  console.log("Error Message:" + err.message + " ErrorNumber:" + err.no);
};

DB.SqliteDB.prototype.createTable = function (sql) {
  DB.db.serialize(function () {
    DB.db.run(sql, function (err) {
      if (null != err) {
        DB.printErrorInfo(err);
        return;
      }
    });
  });
};

/// tilesData format; [[level, column, row, content], [level, column, row, content]]
DB.SqliteDB.prototype.insertData = function (sql, objects) {
  DB.db.serialize(function () {
    var stmt = DB.db.prepare(sql);
    for (var i = 0; i < objects.length; ++i) {
      stmt.run(objects[i]);
    }
    stmt.finalize();
  });
};

DB.SqliteDB.prototype.insertDataTransaction = function (sql, objects,callback) {
  DB.db.serialize(function () {
    var stmt = DB.db.prepare(sql, function(err){
      if (null != err) {
        DB.printErrorInfo(err);
      }
      if(callback) callback(err);
    });
    for (var i = 0; i < objects.length; ++i) {
      stmt.run(objects[i]);
    }
    stmt.finalize();
  });
};

DB.SqliteDB.prototype.queryData = function (sql, callback) {
  DB.db.all(sql, function (err, rows) {
    if (null != err) {
      DB.printErrorInfo(err);
      throw new Error(err.message);
    }
    /// deal query data.
    if (callback) {
      callback(rows);
    }
  });
};

DB.SqliteDB.prototype.executeSql = function (sql) {
  DB.db.run(sql, function (err) {
    if (null != err) {
      DB.printErrorInfo(err);
    }
  });
};

DB.SqliteDB.prototype.transactionFunc = function (funcs) {
  this.begin()
  var arr = [];
  for(item of funcs){
    arr.push(item[0](item[1]));
  }
  return Promise.all(arr).then(() => {
    this.end()
    return Promise.resolve();
  }).catch((err) => {
    this.rollback()
    console.error(err)
    return Promise.reject();
  });
}

DB.SqliteDB.prototype.close = function () {
  DB.db.close();
};

DB.SqliteDB.prototype.rollback = function () {
  DB.db.run("ROLLBACK;");
  console.log("事务回滚")
}

DB.SqliteDB.prototype.begin = function () {
  DB.db.run("BEGIN TRANSACTION;");
  console.log("事务开始")
}

DB.SqliteDB.prototype.end = function () {
  DB.db.run("END TRANSACTION;");
  console.log("事务结束")
}

exports.SqliteDB = DB.SqliteDB;