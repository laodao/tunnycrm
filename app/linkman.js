/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-5
 * Time: 下午11:21
 * To change this template use File | Settings | File Templates.
 */

var config = require('../conf/config'),logger = require('../lib/logger').getLogger(),DBUtil = require('../lib/DBUtil').DBUtil;
var dbUtil = new DBUtil();

exports.get = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from linkman where id=?', [id], function(err, linkman){
        form.addData('linkman', linkman);
        conn.query('select a.*,b.* from ParameterValues a, Parameter b where a.objectId=? and tableName="linkman" and a.parameterId = b.id', [id], function(err, rows){
            form.addData('parameters', rows);
            conn.end();
            fn();
        });
    });
};

exports.edit = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from linkman where id=?', [id], function(err, linkman){
        form.addData('linkman', linkman[0]);
        conn.query('select a.*,b.* from ParameterValues a, Parameter b where a.objectId=? and tableName="linkman" and a.parameterId = b.id', [id], function(err, rows){
            form.addData('parameters', rows);
            conn.end();
            fn();
        });
    });
};

exports.post = function(form, fn){
    var linkman = {};
    form.fill(linkman, ['name', 'sex', 'position','customerId', 'phoneNo', 'email', 'faxNo', 'assistant', 'assistantPhoneNo', 'QQ','skype',  'MSN', 'twitter', 'facebook', 'weibo',
        'englishName', 'birthday', 'address', 'department', 'customerId','salesState', 'intention','remark', 'createAccount']);
    var session = form.getSession();
    var currentUser = session.get(config.currentUser);
    linkman['createAccount'] = currentUser.id;
    linkman['principal'] = currentUser.id;
    var conn = dbUtil.getConn();
    conn.query('insert into linkman set ?', linkman, function(err, linkman){
        if(err){
            logger.error(err);
        }
        var id = linkman.insertId;
        var linkmanParams = [];
        var params = form.getParams();
        var prefix = 'param_';
        for (var key in params){
            if(key.substr(0,prefix.length)===prefix){
                var paramValue = params[key];
                var idAndName = key.substr(prefix.length).split('_');
                var paramName = idAndName[1];
                var paramId = idAndName[0];
                linkmanParams.push({'parameterName':paramName, 'value':params[key], 'parameterId': paramId, 'tableName':'linkman', 'objectId':id});
            }
        }
        conn.query('insert into parameterValues set ?', linkmanParams, function(err, result){
            form.setMsg('添加联系人成功！');
            conn.end();
            fn.json();
        });
    });
};

exports.list = function(form, fn){
    var conn = dbUtil.getConn();
    var pageSize = form.get("pageSize")||10;
    var pageNo = form.get('pageNo');
    var customerId = form.get('customerId');
    if(!pageNo||pageNo<1){
        pageNo = 1;
    }
    var start = pageSize*(pageNo-1);
    var sql = 'select * from linkman where 1=1';
    var countSql = 'select count(*) as count from linkman where 1=1';
    var params = [];
    if(customerId){
        sql += ' and parentId=?';
        countSql += ' and parentId=?';
        params.push(customerId);
    }
    sql += ' limit '+start+','+(start+pageSize);
    conn.query(countSql, params, function(err, count){
        var total = count[0].count;
        var totalPages = Math.ceil(total/pageSize);
        conn.query(sql, params, function(err, rows){
            conn.end();
            form.addData('linkmanList', rows);
            form.addData('pageNo', pageNo);
            form.addData('pageSize', pageSize);
            form.addData('totalPages', totalPages);
            fn();
        });
    })
};

exports.put = function(form, fn){
    var id = form.get('id');
    var linkman = {};
    form.fill(linkman, ['name', 'sex', 'position','customerId', 'phoneNo', 'email', 'faxNo', 'assistant', 'assistantPhoneNo', 'QQ', 'MSN', 'Skype', 'twitter', 'facebook', 'weibo',
        'englishName', 'birthday', 'address', 'department', 'customerId','salesState', 'intention','remark', 'createAccount']);
    var conn = dbUtil.getConn();
    var update = conn.query('update linkman set ? where id=?', [linkman, id], function(err, linkman){
        if(err){
            logger.error(err);
        }
        var id = 0;
//        var id = linkman.insertId;
        var linkmanParams = [];
        var params = form.getParams();
        var prefix = 'param_';
        var sql = '';
        for (var key in params){
            if(key.substr(0,prefix.length)===prefix){
                var paramValue = params[key];
                var idAndName = key.substr(prefix.length).split('_');
                var paramName = idAndName[1];
                var paramId = idAndName[0];
                var paramValueId = idAndName[2];
                linkmanParams.push({'parameterName':paramName, 'value':params[key], 'parameterId': paramId, 'tableName':'linkman', 'objectId':id});
                linkmanParams.push(paramValueId);
                sql+='update parameterValues set ? where id=?;';
            }
        }
        logger.info(update.sql);
        if(sql.length>0){
            sql.substr(0,sql.length-1);
            conn.query(sql, linkmanParams, function(err, result){
                form.setMsg('修改客户成功！');
                conn.end();
                fn.json();
            });
        }else{
            conn.end();
            fn.json();
        }
    });
};

exports.delete = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('delete from ParameterValues where tableName="linkman" and objectId = ?',[id],function(err, result){
        conn.query('delete from linkman where id=?', id, function(err, result){
            form.setMsg('删除成功！');
            conn.end();
            fn.json();
        });
    });
};

exports.search = function(form, fn){
    //var customer
};

exports.add = function(form, fn){
    fn();
};