var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_xiela',
  password        : 'cbfaiid',
  database        : 'cs340_xiela'
});

module.exports.pool = pool;
