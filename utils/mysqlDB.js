
const mysql = require('mysql');
const cryptoUtil = require('./crypto/cryptoUtil');
const dbConfig = require('./config').dbConfig;

const pool  =  mysql.createPool({
                connectionLimit : 10,
                host     : cryptoUtil.privateDecrypt(dbConfig.host).toString(),
                user     : cryptoUtil.privateDecrypt(dbConfig.user).toString(),
                password : cryptoUtil.privateDecrypt(dbConfig.password).toString(),
                database : cryptoUtil.privateDecrypt(dbConfig.database).toString()
              });
pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});
            
pool.on('connection', function (connection) {
  connection.query('SET SESSION auto_increment_increment=1')
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

const getConnection = ( ) => {
  return new Promise(( resolve, reject ) => {
    pool.getConnection( (err, connection) => {
      if (err) {
        console.log('*****获取连接异常：' + err);
        reject( err )
      } else {
        resolve(connection)
      }
    })
  })
}

const query = (connection, sql, values ) => {
  return new Promise(( resolve, reject) => {
    console.log('sql:'+ sql)
    connection.query(sql, values, ( err, rows) => {
      if ( err ) {
        console.log('*****查询异常：' + err);
        reject( err )
      } else {
        resolve( rows )
      }
    })
  })
}

const beginTransaction = (connection) => {
  return new Promise(( resolve, reject ) => {
    connection.beginTransaction(function(err) {
      if (err) { 
        console.log('*****开始事务异常：'+err);
        reject(err)
      }else{
        resolve();
      }
    })
  })
}

const commit = (connection) => {
  return new Promise(( resolve, reject ) => {
    connection.commit(function(err) {
      if (err) {
        console.log('*****提交异常：' +err)
        return connection.rollback(function() {
          reject(err)
        });
      }
      console.log('commit success!');
      resolve(true);
    })
  })
}

const rollback = (connection, err) => {
  return new Promise(( resolve, reject ) => {
    connection.rollback(function() {
      console.error('*****回滚成功，回滚原因：'+err)
      resolve(false)
    })
  })
}

class MysqlDB {
  constructor(){
    if(!pool){
      mysql.createPool({
        connectionLimit : 10,
        host     : cryptoUtil.privateDecrypt(dbConfig.host).toString(),
        user     : cryptoUtil.privateDecrypt(dbConfig.user).toString(),
        password : cryptoUtil.privateDecrypt(dbConfig.password).toString(),
        database : cryptoUtil.privateDecrypt(dbConfig.database).toString()
      });
    }
  }
  queryOnly(sql, values){
    return new Promise(( resolve, reject ) => {
      pool.getConnection( (err, connection) => {
        if (err) {
          reject( err )
        } else {
          connection.query(sql, values, ( err, rows) => {
            if ( err ) {
              reject( err )
            } else {
              resolve( rows )
            }
            connection.release()
          })
        }
      })
    })
  }
  async transactionFunc(funcs) {
    console.log("开始保存")
    let connection = null;
    try{
      connection = await getConnection();
      await beginTransaction(connection)
      let arr = [];
      for(let item of funcs){
        arr.push(query(connection, item[0], item[1]));
      }
      await Promise.all(arr)
      return commit(connection)
    }catch(err){
      return rollback(connection, err)
    }finally{
      connection.release()
    }
  }
}

module.exports = new MysqlDB()