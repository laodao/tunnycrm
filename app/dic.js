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
    conn.query('select * from dictionary where id=?', [id], function(err, rows){
        if(rows&&rows.length>0){
            var dictionary = rows[0];
            form.addData('dictionary', dictionary);
        }
        conn.end();
        fn();
    });
};

exports.post = function(form, fn){
    var dictionary = {};
    form.fill(dictionary, ['code', 'dicName', 'categoryId','status']);
    var conn = dbUtil.getConn();
    conn.query('insert into dictionary set ?',dictionary, function(err, result){
        if(err){
            logger.error(err);
        }
        form.setMsg('添加成功！');
        conn.end();
        fn.json();
    });
};

exports.list = function(form, fn){
    var conn = dbUtil.getConn();
    var pageSize = form.get("pageSize")||10;
    var pageNo = form.get('pageNo');
    var categoryId = form.get('categoryId');
    if(!pageNo||pageNo<1){
        pageNo = 1;
    }
    var start = pageSize*(pageNo-1);
    var sql = 'select * from dictionary where status="usable"';
    var countSql = 'select count(*) as count from dictionary where status="usable"';
    var params = [];
    if(!categoryId){
        categoryId = 0;
    }
    sql += ' and categoryId=? limit '+start+','+pageSize;
    countSql += ' and categoryId=?';
    params.push(categoryId);
    conn.query(countSql, params, function(err, count){
        if(err){
            logger.error(err);
        }
        var total = count[0].count;
        var totalPages = Math.ceil(total/pageSize);
        conn.query(sql, params, function(err, rows){
            conn.query('select * from dicCategory where id=?', [categoryId], function(err, category){
                conn.end();
                form.addData('dicList', rows);
                form.addData('pageNo', pageNo);
                form.addData('pageSize', pageSize);
                form.addData('totalPages', totalPages);
                form.addData('categoryId', categoryId);
                form.addData('categoryName', category[0].categoryName);
                fn();
            });
        });
    });
};

exports.all = function(form, fn){
    var categoryId = form.get('categoryId');
//    var conn = dbUtil.getConn();
}

exports.delete = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('delete from dictionary where id = ?',[id],function(err, result){
        if(err){
            logger.error(err);
        }
        form.setMsg('删除成功！');
        conn.end();
        fn.json();
    });
};

exports.put = function(form, fn){
    var id = form.get('id');
    var dictionary = {};
    form.fill(dictionary, ['code', 'dicName', 'categoryId', 'status']);
    var conn = dbUtil.getConn();
    conn.query('update dictionary set ? where id=?',[dictionary, id], function(err, result){
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
        categoryId = 0;
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
    conn.query('select * from dictionary where id=?', [id], function(err, rows){
        if(err){
            logger.error(err);
        }
        form.addData('dic', rows[0]);
        conn.query('select * from dicCategory where id=?',[rows[0].categoryId], function(err, category){
            form.addData('category', category[0]);
            conn.end();
            fn();
        });
    });
};