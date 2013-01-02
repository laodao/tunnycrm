/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-5
 * Time: 下午10:19
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
    conn.query('select a.*,b.deptName from account a,department b where a.id=? and b.id=a.deptId',[id], function(err, rows, fields){
        var row = rows[0];
        form.addData('account', row);
        conn.query('select * from department', [], function(err, depts){
            form.addData('deptList',depts);
            conn.end();
            fn();
        });
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
    var query = conn.query('insert into account set ?',{'account':account,'username':username, "passwd":cipherPasswd, "email":email, "deptId": deptId, "position":position, 'lastLoginTime':new Date()},function(err, account){
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
    conn.query('select count(*) as count from account', [], function(err, counts){
        var total = counts[0].count;
        var totalPages = Math.ceil(total/pageSize);
        conn.query('select a.*,b.deptName from account a,department b where b.id=a.deptId limit '+start+','+pageSize,[],function(err, rows){
            conn.end();
            form.addData('accountList', rows);
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
    var query = conn.query('delete from account where id = ?', [id], function(err, result){
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
    var account = form.get('account');
    var username = form.get('username');
    var email = form.get('email');
    var deptId = form.get('deptId');
    var position = form.get('position');
    var conn = dbUtil.getConn();
    conn.query('update account set ? where id=?',[{'account':account,'username':username, "email":email, "deptId": deptId, "position":position},id],function(err, account){
        conn.end();
        form.setMsg('修改用户成功！');
        fn.json();
    });
};

exports.updatePasswd = function(form, fn){
    var session = from.getSession();
    var user = session.get(config.currentUser);
    var account = user.account;
    var passwd = form.get('passwd');
    var oldPasswd = form.get('oldPasswd');
    var conn = dbUtil.getConn();
    var md5 = crypto.createHash('md5');
    var cipherOldPasswd = md5.update(oldPasswd).digest("hex");
    var cipherPasswd = md5.update(passwd).digest("hex");
    conn.query('select id from account where account=? and passwd=?',[account, cipherOldPasswd], function(err, account){
        if(account){
            conn.query('update account set', {'passwd': cipherPasswd},function(err, result){
                form.setMsg('密码修改成功！');
                fn();
            });
        }else{
            form.setMsg('用户名或者密码错误！');
            fn();
        }
    })
};

exports.add = function(form, fn){
    fn();
};