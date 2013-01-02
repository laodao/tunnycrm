/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-5
 * Time: 下午8:37
 * To change this template use File | Settings | File Templates.
 */

var crypto = require('crypto'),config = require('../conf/config'),constant = require('../lib/constant'),
    logger = require('../lib/logger').getLogger(),DBUtil = require('../lib/DBUtil').DBUtil;
var dbUtil = new DBUtil();

exports.get = function(form, fn){
    fn();
};

exports.post = function(form, fn){
    var account = form.get('account');
    var passwd = form.get('passwd');
    var md5 = crypto.createHash('md5');
    var cipherPasswd = md5.update(passwd).digest("hex");
    var conn = dbUtil.getConn();
    var query = conn.query('select * from account where account=? and passwd=?', [account, cipherPasswd], function(err, rows){
        if(err){
            logger.error(err);
            logger.debug(query.sql);
            fn.redirect('/login');
        }
        if(rows.length>0){
            var accountTmp = rows[0];
            var session = form.getSession();
            session.set(config.currentUser, accountTmp);
            session.set(config.userID, accountTmp.id);
            var url = session.get(constant.urlBeforeLogin);
            if(!url || url==="/login"){
                url= config.indexPage||"/index";
            }
            fn.redirect(url);
        }else{
            form.setMsg("用户名或者密码错误！");
            fn.redirect('/login');
        }

    })
}