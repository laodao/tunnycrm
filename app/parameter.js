/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-25
 * Time: 下午1:31
 * To change this template use File | Settings | File Templates.
 */
var crypto = require('crypto'),config = require('../conf/config'),logger = require('../lib/logger').getLogger(),DBUtil = require('../lib/DBUtil').DBUtil;
var dbUtil = new DBUtil();

exports.get = function(form, fn){
    var conn = dbUtil.getConn();
    var id = form.get('id');
    conn.query('select a.*,b.deptName from account a,department b where a.id=? and b.id=a.id',[id], function(err, rows, fields){
        conn.end();
        var row = rows[0];
        form.addData('account', row);
        fn.json();
    });
};

exports.edit = function(form, fn){
    var conn = dbUtil.getConn();
    var id = form.get('id');
    conn.query('select a.* from parameter a where a.id=? and b.id=a.deptId',[id], function(err, rows, fields){
        var row = rows[0];
        form.addData('parameter', row);
        conn.end();
        fn();
    });
};

exports.post = function(form, fn){
    var account = form.get('account');
    var passwd = form.get('passwd');
    var username = form.get('username');
    var email = form.get('email');
    var deptId = form.get('deptId');
    var position = form.get('position');
    var md5 = crypto.createHash('md5');
    var cipherPasswd = md5.update(passwd).digest("hex");
    var conn = dbUtil.getConn();
    var query = conn.query('insert into parameter set ?',{'parameter':parameter,'username':username, "passwd":cipherPasswd, "email":email, "deptId": deptId, "position":position, 'lastLoginTime':new Date()},function(err, parameter){
        conn.end();
        if(err){
            logger.error(err);
            form.setMsg('添加帐号报错！');
        }else{
            form.setMsg('添加用户成功！');
        }
        logger.info(query.sql);
        fn.json();
    });
};

exports.list = function(form, fn){
    var session = form.getSession();
    var pageSize = form.get("pageSize")||10;
//    if(!pageSize){
//        pageSize = 10;
//    }
    var pageNo = form.get('pageNo');
    if(!pageNo||pageNo<1){
        pageNo = 1;
    }
    var start = pageSize*(pageNo-1);
    var conn = dbUtil.getConn();
    conn.query('select count(*) as count from parameter', [], function(err, counts){
        var total = counts[0].count;
        var totalPages = Math.ceil(total/pageSize);
        conn.query('select a.*,b.deptName from parameter a,department b where b.id=a.deptId limit '+start+','+pageSize,[],function(err, rows){
            conn.end();
            form.addData('parameterList', rows);
            form.addData('pageNo', pageNo);
            form.addData('pageSize', pageSize);
            form.addData('totalPages', totalPages);
            fn();
        });
    });
};

exports.delete = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    var query = conn.query('delete from parameter where id = ?', [id], function(err, result){
        if(err){
            logger.error(err);
            form.setMsg('删除失败！');
            logger.info(query.sql);
            fn.json();
        }else{
            form.setMsg('删除成功！');
            conn.end();
            logger.info(query.sql);
            fn.json();
        }
    });
};

exports.put = function(form, fn){
    var id = form.get('id');
    var parameter = form.get('parameter');
    var username = form.get('username');
    var email = form.get('email');
    var deptId = form.get('deptId');
    var position = form.get('position');
    var conn = dbUtil.getConn();
    conn.query('update parameter set ? where id=?',[{'parameter':parameter,'username':username, "email":email, "deptId": deptId, "position":position},id],function(err, parameter){
        conn.end();
        form.setMsg('修改用户成功！');
        fn.json();
    });
};

exports.add = function(form, fn){
    fn();
};