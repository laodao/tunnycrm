/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-28
 * Time: 下午10:44
 * To change this template use File | Settings | File Templates.
 */

var config = require('../conf/config'),logger = require('../lib/logger').getLogger(),DBUtil = require('../lib/DBUtil').DBUtil;
var dbUtil = new DBUtil();

exports.get = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from salesList where id=?', [id], function(err, salesList){
        form.addData('salesList', salesList);
        conn.query('select a.*,b.* from ParameterValues a, Parameter b where tableName="salesList" and  a.objectId=? and a.parameterId = b.id ', [id], function(err, rows){
            form.addData('parameters', rows);
            conn.end();
            fn();
        });
    });
};

exports.edit = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from salesList where id=?', [id], function(err, salesList){
        form.addData('salesList', salesList[0]);
        conn.query('select a.*,b.* from ParameterValues a, Parameter b where tableName="salesList" and  a.objectId=? and a.parameterId = b.id ', [id], function(err, parameters){
            form.addData('parameters', parameters);
            var conn = dbUtil.getConn();
            conn.query("select a.*, b.id as cId,b.code as cCode from dictionary a, dicCategory b where a.categoryId = b.id and b.code in ('industry','salesListNature','source','salesListType','scale','assets','turnover','salesListStatus')",
                [],
                function(err, rows){
                    var dics = {salesListNature:[],scale:[],assets:[],source:[],turnover:[],salesListStatus:[],industry:[],salesListType:[]};
                    if(err){
                        logger.error(err);
                    }
                    rows.forEach(function(row){
                        dics[row.cCode].push(row);
                    });
                    form.addData('dics', dics);
                    conn.end();
                    fn();
                }
            );
        });
    });
};

exports.post = function(form, fn){
    var salesList = {};
    form.fill(
        salesList,
        ['salesListName', 'legalRepresentative', 'assets', 'turnover', 'scale', 'source', 'industry',
            'salesListNature', 'salesListType', 'salesListStatus', 'phoneNo', 'email', 'faxNo', 'address', 'remark']
    );
    var session = form.getSession();
    var currentUser = session.get(config.currentUser);
    salesList['createAccount'] = currentUser.id;
    var conn = dbUtil.getConn();
    conn.query('insert into salesList set ?', salesList, function(err, salesList){
        if(err){
            logger.error(err);
        }
        var id = salesList.insertId;
//        var id = 0;
        var salesListParams = [];
        var params = form.getParams();
        var prefix = 'param_';
        for (var key in params){
            if(key.substr(0,prefix.length)===prefix){
                var paramValue = params[key];
                var idAndName = key.substr(prefix.length).split('_');
                var paramName = idAndName[1];
                var paramId = idAndName[0];
                salesListParams.push({'parameterName':paramName, 'value':paramValue, 'parameterId': paramId, 'tableName':'salesList', 'objectId':id});
            }
        };
        if(salesListParams.length>0){
            conn.query('insert into parameterValues set ?', salesListParams, function(err, result){
                form.setMsg('添加客户成功！');
                conn.end();
                fn.json();
            });
        }else{
            form.setMsg('添加客户成功！');
            conn.end();
            fn.json();
        }
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
    conn.query('select count(*) as count from salesList', [], function(err, counts){
        var total = counts[0].count;
        var totalPages = Math.ceil(total/pageSize);
        conn.query('select a.*,' +
            '(select dicName from dictionary where code=a.assets) as assetsCN,' +
            '(select dicName from dictionary where code=a.turnover) as turnoverCN,' +
            '(select dicName from dictionary where code=a.scale) as scaleCN,' +
            '(select dicName from dictionary where code=a.source) as sourceCN,' +
            '(select dicName from dictionary where code=a.industry) as industryCN,' +
            '(select dicName from dictionary where code=a.salesListNature) as salesListNatureCN,' +
            '(select dicName from dictionary where code=a.salesListType) as salesListTypeCN,' +
            '(select dicName from dictionary where code=a.salesListStatus) as salesListStatusCN' +
            ' from salesList a limit '+start+','+pageSize, [], function(err, rows){
            form.addData('salesListList', rows);
            form.addData('pageNo', pageNo);
            form.addData('pageSize', pageSize);
            form.addData('totalPages', totalPages);
            conn.end();
            fn();
        });
    });
};

exports.put = function(form, fn){
    var id = form.get('id');
    var salesList = {};
    form.fill(salesList, ['salesListName', 'legalRepresentative', 'assets', 'turnover', 'scale', 'source', 'industry', 'salesListNature', 'salesListType', 'salesListStatus', 'phoneNo', 'email', 'faxNo', 'address', 'remark']);
    var conn = dbUtil.getConn();
    conn.query('update salesList set ? where id=?', [salesList, id], function(err, salesList){
        if(err){
            logger.error(err);
        }
        var id = salesList.insertId;
        var salesListParams = [];
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
                salesListParams.push({'parameterName':paramName, 'value':paramValue, 'parameterId': paramId, 'tableName':'salesList', 'objectId':id});
                salesListParams.push(paramValueId);
                sql+='update parameterValues set ? where id=?;';
            }
        }
        if(sql.length>0){
            sql.substr(0,sql.length-1);
        }
        conn.query(sql, salesListParams, function(err, result){
            form.setMsg('修改客户成功！');
            conn.end();
            fn.json();
        });
    });
};

exports.delete = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('delete from ParameterValues where tableName="salesList" and objectId = ?',[id],function(err, result){
        if(err){
            logger.error(err);
        }
        conn.query('delete from salesList where id=?', [id], function(err, result){
            form.setMsg('删除成功！');
            conn.end();
            fn.json();
        });
    });
};

exports.add = function(form, fn){
    var conn = dbUtil.getConn();
    conn.query("select a.*, b.id as cId,b.code as cCode from dictionary a, dicCategory b where a.categoryId = b.id and b.code in ('industry','salesListNature','source','salesListType','scale','assets','turnover','salesListStatus')",
        [],
        function(err, rows){
            var dics = {salesListNature:[],scale:[],source:[],assets:[],turnover:[],salesListStatus:[],industry:[],salesListType:[]};
            if(err){
                logger.error(err);
            }
            rows.forEach(function(row){
                dics[row.cCode].push(row);
            });
            form.addData('dics', dics);
            conn.end();
            fn();
        }
    );
};