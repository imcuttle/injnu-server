/**
 * Created by Moyu on 16/11/18.
 */

var mysql = require('mysql');

var config = {
    host     : 'localhost',
    user     : 'root',
    password : '110114',
    database : 'best-njnu',
    // queueLimit: 50,
    // connectionLimit: 20,
    // waitForConnections: false
};


var database = mysql.createPool(config);

module.exports = {
    query: function() {
        var argArr = Array.from(arguments);
        var cb = argArr.splice(-1)[0];

        database.getConnection(function(err, dbConnection) {
            if (err) { console.error(err); return }
            dbConnection.query.apply(dbConnection, argArr.concat(function() {
                dbConnection.release(); // return to the pool
                cb.apply(null, Array.from(arguments));
            }));
        })
    },
    format: mysql.format,
    likeStrFilter: function (s) {
        return '%'+s.replace(/([_%])/g,'*'+RegExp.$1)+'%';
    },
    
};

