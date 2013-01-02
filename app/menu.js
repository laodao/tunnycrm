/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-24
 * Time: 下午10:58
 * To change this template use File | Settings | File Templates.
 */

var config = require('../conf/config'),logger = require('../lib/logger').getLogger(),DBUtil = require('../lib/DBUtil').DBUtil;
var dbUtil = new DBUtil();

exports.get = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from menu where id=?', [id], function(err, rows){
        if(rows&&rows.length>0){
            var menu = rows[0];
            form.addData('menu', menu);
        }
        conn.end();
        fn();
    });
};

exports.post = function(form, fn){
    var menu = {};
    form.fill(menu, ['menuName', 'menuCode', 'level', 'order','url', 'parentId', 'status', 'remark']);
    var conn = dbUtil.getConn();
    conn.query('insert into menu set ?',menu, function(err, result){
        conn.end();
        if(err){
            logger.error(err);
            form.setMsg('添加失败！');
            fn.json();
        }else{
            form.setMsg('添加成功！');
            fn.json();
        }
    });
};

exports.list = function(form, fn){
    var conn = dbUtil.getConn();
    var pageSize = form.get("pageSize")||10;
    var pageNo = form.get('pageNo');
    var parentId = form.get('parentId');
    if(!pageNo||pageNo<1){
        pageNo = 1;
    }
    var start = pageSize*(pageNo-1);
    var sql = 'select * from menu where status="usable"';
    var countSql = 'select count(*) as count from menu where status="usable"';
    var params = [];
    if(!parentId){
        parentId = 0;
    }
    sql += ' and parentId=? order by \'order\' limit '+start+','+pageSize;
    countSql += ' and parentId=?';
    params.push(parentId);
    conn.query(countSql, params, function(err, count){
        if(err){
            logger.error(err);
        }
        var total = 0;
//        var total = count[0].count;
        var totalPages = Math.ceil(total/pageSize);
        var query = conn.query(sql, params, function(err, rows){
            conn.query('select * from menu where id=?', [parentId], function(err, menus){
                form.addData('parent', menus[0]);
                form.addData('menuList', rows);
                conn.end();
                form.addData('pageNo', pageNo);
                form.addData('pageSize', pageSize);
                form.addData('totalPages', totalPages);
                form.addData('parentId', parentId);
                logger.info(query.sql);
                fn();
            });
        });
    });
};

exports.delete = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select id from menu  where parentId = ?',[id], function(err, rows){
        if(rows&&rows.length>0){
            conn.end();
            var msg='有子菜单，请先删除子部门！';
            form.setMsg(msg);
            fn.json();
        }else{
            conn.query('delete from menu where id = ?',[id],function(err, result){
                if(err){
                    logger.error(err);
                }
                form.setMsg('删除成功！');
                conn.end();
                fn.json();
            });
        }
    });
};

exports.put = function(form, fn){
    var menu = {};
    var id = form.get('id');
    form.fill(menu, ['menuName','code', 'parentId', 'remark','status']);
    var conn = dbUtil.getConn();
    conn.query('update menu set ? where id=?',[menu,id], function(err, result){
        if(err){
            logger.error(err);
        }
        form.setMsg('修改成功！');
        conn.end();
        fn.json();
    });
};

exports.add = function(form, fn){
    var parentId = form.get('parentId');
    if(!parentId){
        parentId = '0';
    }
    var conn = dbUtil.getConn();
    conn.query('select a.*,(select count(id)+1 from menu where parentId = a.id) as childSum from menu a where a.id=?', [parentId], function(err, menus){
        form.addData('parent', menus[0]);
        form.addData('menuId', parentId);
        fn();
    });
};

exports.edit = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from menu where id=?', [id], function(err, menu){
        form.addData('menu', menu[0]);
        form.addData('parentId', menu[0].parentId);
        fn();
    });
};