/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-12-7
 * Time: 下午10:33
 * To change this template use File | Settings | File Templates.
 */

var logger = require('../lib/logger').getLogger(),DBUtil = require('../lib/DBUtil').DBUtil,HashMap = require('./HashMap').HashMap;
var dbUtil = new DBUtil();

var cache = new HashMap();
var conn = dbUtil.getConn();
conn.query('select * from dictionary', [], function(err, dicList){
    cache.put('dictionary', dicList);
    conn.query('select * from dicCategory', [], function(err, categoryList){
        cache.put('dicCategory', categoryList);
        conn.query('select * from department', [], function(err, deptList){
            cache.put('department', deptList);
        });
    });
});

exports.get = function(tableName){
    var data = cache.get(tableName);
    return data;
};