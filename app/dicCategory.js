/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-8
 * Time: 下午9:54
 * To change this template use File | Settings | File Templates.
 */

var config = require('../conf/config'),logger = require('../lib/logger').getLogger(),DBUtil = require('../lib/DBUtil').DBUtil;
var dbUtil = new DBUtil();

exports.get = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from dicCategory where id=?', [id], function(err, rows){
        if(rows&&rows.length>0){
            var dicCategory = rows[0];
            form.addData('dicCategory', dicCategory);
        }
        conn.end();
        fn();
    });
};

exports.post = function(form, fn){
    var dicCategory = {};
    form.fill(dicCategory, ['categoryName', 'code', 'parentId', 'remark']);
    var conn = dbUtil.getConn();
    conn.query('insert into dicCategory set ?',dicCategory, function(err, result){
        conn.end();
        if(err){
            logger.error(err);
            form.setMsg('删除失败！');
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
    var sql = 'select a.*,(select count(id) from dictionary where categoryId=a.id) as hasChild from dicCategory a where status="usable"';
    var countSql = 'select count(*) as count from dicCategory where status="usable"';
    var params = [];
    if(!parentId){
        parentId = 0;
    }
    sql += ' and parentId=? limit '+start+','+pageSize;
    countSql += ' and parentId=?';
    params.push(parentId);
    conn.query(countSql, params, function(err, count){
        var total = count[0].count;
        var totalPages = Math.ceil(total/pageSize);
        var query = conn.query(sql, params, function(err, categorys){
            conn.query('select * from dicCategory where id=?', [parentId], function(err, rows){
                conn.end();
                if(rows.length>0){
                    form.addData('parent', rows[0]);
                    form.addData('categoryList', categorys);
                    form.addData('pageNo', pageNo);
                    form.addData('pageSize', pageSize);
                    form.addData('totalPages', totalPages);
                    form.addData('parentId', parentId);
                    logger.info(query.sql);
                    fn();
                }
            });
        });
    });
};

exports.delete = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select id from dicCategory where a.parentId = ?',[id], function(err, rows){
        if(rows&&rows.length>0){
            conn.end();
            form.setMsg('有子菜单，请先删除子菜单！');
            fn.json();
        }else{
            conn.query('delete from dicCategory where id = ?',[id],function(err, result){
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
    var dicCategory = {};
    var id = form.get('id');
    form.fill(dicCategory, ['categoryName','code', 'parentId', 'remark','status']);
    var conn = dbUtil.getConn();
    conn.query('update dicCategory set ? where id=?',[dicCategory,id], function(err, result){
        if(err){
            logger.error(err);
        }
        form.setMsg('修改成功！');
        conn.end();
        fn.json();
    });
};

exports.add = function(form, fn){
    var categoryId = form.get('categoryId');
    if(!categoryId){
        categoryId = '0';
    }
    var conn = dbUtil.getConn();
    conn.query('select * from dicCategory where id=?', [categoryId], function(err, category){
        if(err){
            logger.error(err);
        }
        form.addData('category', category[0]);
        form.addData('categoryId', categoryId);
        conn.end();
        fn();
    });
};

exports.edit = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from dicCategory where id=?', [id], function(err, dicCategory){
        form.addData('dicCategory', dicCategory[0]);
        form.addData('parentId', dicCategory[0].parentId);
        fn();
    })
};