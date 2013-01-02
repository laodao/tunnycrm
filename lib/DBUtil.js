/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-4
 * Time: 下午8:43
 * To change this template use File | Settings | File Templates.
 */

var mysql = require('mysql'), config = require('../conf/config'),HashMap = require('../lib/HashMap').HashMap;

var pools = new HashMap();
var ds = config.dataSource;
function ConnPool(){
    this.conns=[];
}
ConnPool.prototype.pop = function(){
    return this.conns.pop();
};

ConnPool.prototype.add = function(conn){
    return this.conns.push(conn);
};

ConnPool.prototype.close = function(conn){
    this.conns.push(conn);
};

//ds.forEach(function(_ds){
//    var pool = new ConnPool();
//    var poolSize = _ds.poolSize|| 5;
//    for(var i=0;i<5;i++){
//        var conn = mysql.createConnection(
//            {
//                host:_ds.host,
//                port:_ds.port||3306,
//                user:_ds.username,
//                password:_ds.password,
//                database:_ds.database
//            }
//        );
//        pool.add(conn);
//    }
//    pools.put(_ds.database, pool);
//});

function DBUtil(database){
    if(!database){
        var keys = pools.getKeys();
        this.database = keys[0];
    }else{
        this.database = database;
    }
}

DBUtil.prototype.close = function(conn){
    var pool = pools.get(this.database);
    pool.close(conn);
};

DBUtil.prototype.getConn = function(){
//    return pools.get(this.database).pop();
    var conn = mysql.createConnection(
        {
            host:ds.host,
            port:ds.port||3306,
            user:ds.username,
            password:ds.password,
            database:ds.database,
            multipleStatements: true
        }
    );
    return conn;
};


exports.DBUtil = DBUtil;