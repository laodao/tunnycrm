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
    conn.query('select * from department where id=?', [id], function(err, rows){
        if(rows&&rows.length>0){
            var department = rows[0];
            form.addData('department', department);
        }
        conn.end();
        fn();
    });
};

exports.post = function(form, fn){
    var department = form.fill(['deptName', 'parent', 'level']);
    var conn = dbUtil.getConn();
    conn.query('insert into department set ?',department, function(err, result){
        form.setMsg('添加成功！');
        conn.end();
        fn();
    });
};

exports.list = function(form, fn){
    var conn = dbUtil.getConn();
    var pageSize = form.get("pageSize")||10;
    var pageNo = form.get('pageNo');
    if(!pageNo||pageNo<1){
        pageNo = 1;
    }
    var start = pageSize*(pageNo-1);
    conn.query('select * from department limit '+start+','+pageSize, [], function(err, rows){
        form.addData('deptList', rows);
        conn.end();
        fn();
    });
};

exports.all = function(form, fn){
    var conn = dbUtil.getConn();
    conn.query('select * from department', [], function(err, rows){
        form.addData('deptList', rows);
        conn.end();
        fn.json();
    });
}

exports.delete = function(form, fn){
    var ids = form.get('ids');
    var conn = dbUtil.getConn();
    conn.query('select a.*,b.deptName as parentName from department a,department b where a.parent in ? and b.id=a.parent',ids, function(err, rows){
        if(rows&&rows.length>0){
            conn.end();
            var msg = '';
            rows.forEach(function(row){
                msg+=row.parentName+',';
            });
            msg+='有子部门，请先删除子部门！';
            fn.json();
        }else{
            conn.query('delete from department where id in ?',ids,function(err, result){
                form.setMsg('删除成功！');
                conn.end();
                fn.json();
            });
        }
    });
};

exports.put = function(form, fn){
    var department = form.fill(['deptName', 'parent', 'level']);
    var conn = dbUtil.getConn();
    conn.query('update department set ?',department, function(err, result){
        form.setMsg('修改成功！');
        conn.end();
        fn();
    });
};