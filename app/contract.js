/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-28
 * Time: 下午10:44
 * To change this template use File | Settings | File Templates.
 */

var config = require('../conf/config'),logger = require('../lib/logger').getLogger(),DBUtil = require('../lib/DBUtil').DBUtil,cache = require('../lib/cache');
var dbUtil = new DBUtil();

exports.get = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from contract where id=?', [id], function(err, contract){
        form.addData('contract', contract);
        conn.query('select a.*,b.* from ParameterValues a, Parameter b where tableName="contract" and  a.objectId=? and a.parameterId = b.id ', [id], function(err, rows){
            form.addData('parameters', rows);
            conn.end();
            fn();
        });
    });
};

exports.edit = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
    conn.query('select * from contract where id=?', [id], function(err, contract){
        form.addData('contract', contract[0]);
        conn.query('select a.* from salesList a, contract b where a.customerId=b.id and a.id=? ', [id], function(err, salesList){
            form.addData('salesList', salesList);
            conn.query("select id,customerName from customer",
                [],
                function(err, customerList){
                    if(err){
                        logger.error(err);
                    }
                    form.addData('customerList', customerList);
                    conn.query("select id,'name' from linkman",[],function(err, linkmanList){
                        form.addData('linkmanList', linkmanList);
                        conn.end();
                        fn();
                    });
                }
            );
        });
    });
};

exports.post = function(form, fn){
    var contract = {};
    form.fill(
        contract,
        ['title', 'type', 'contractNo', 'signedDate', 'effectiveDate', 'amount', 'cost', 'contractFile',
            'createTime', 'salesman', 'createAccount', 'customerId', 'linkmanId', 'status']
    );
    var session = form.getSession();
    var currentUser = session.get(config.currentUser);
    contract['createAccount'] = currentUser.id;
    var conn = dbUtil.getConn();
    conn.query('insert into contract set ?', contract, function(err, contract){
        if(err){
            logger.error(err);
        }else{
            form.setMsg('添加合同成功！');
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
    conn.query('select count(*) as count from contract a', [], function(err, counts){
        var total = counts[0].count;
        var totalPages = Math.ceil(total/pageSize);
        var query = conn.query('select a.*,(select b.customerName from customer b where b.id=a.customerId) as customer, ' +
//            '(select c.linkmanName from linkman c where c.id=a.linkmanId) as linkman ' +
//            '(select d.account from account d where d.id=a.salesman) as salesmanName ' +
            'from contract a limit '+start+','+pageSize,
            [],
            function(err, rows){
                if(err){
                    logger.error(err);
                    logger.debug(query.sql);
                    fn();
                }
                form.addData('contractList', rows);
                form.addData('pageNo', pageNo);
                form.addData('pageSize', pageSize);
                form.addData('totalPages', totalPages);
                conn.end();
                fn();
            }
        );
    });
};

exports.put = function(form, fn){
    var id = form.get('id');
    var contract = {};
    form.fill(contract, ['title', 'type', 'contractNo', 'signedDate', 'effectiveDate', 'amount', 'cost', 'contractFile',
        'createTime', 'salesman', 'createAccount', 'customerId', 'linkmanId', 'status']);
    var conn = dbUtil.getConn();
    conn.query('update contract set ? where id=?', [contract, id], function(err, contract){
        if(err){
            logger.error(err);
        }
        form.setMsg('修改合同成功！');
        conn.end();
        fn.json();
    });
};

exports.delete = function(form, fn){
    var id = form.get('id');
    var conn = dbUtil.getConn();
        conn.query('delete from contract where id=?', [id], function(err, result){
        form.setMsg('删除成功！');
        conn.end();
        fn.json();
    });
};

exports.add = function(form, fn){
    var conn = dbUtil.getConn();
    var data = cache.get('dictionary');
    console.log(data);
    conn.query('select id,customerName from customer',[],function(err, rows){
        form.addData('customerList', rows);
        fn();
    });
};