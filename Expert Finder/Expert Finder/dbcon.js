var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs361_minikenh',
  password        : 'CS361_Quaranteam',
  database        : 'cs361_minikenh'
});

module.exports.pool = pool;
