/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-6-8
 * Time: 下午4:17
 * To change this template use File | Settings | File Templates.
 */
var config = require('../conf/config'), constant = require('../lib/constant');

exports.before = function(form, fn){
    var session = form.getSession();
    var currentUser = session.get(config.currentUser);
    if(form.getReqType()==="ws"){
        var url = form.getSocket().namespace.name;
    }else{
        var url = form.getReq().url;
    }
    if(url===config.loginUrl||url==="/register"){
        fn.next()
    }else{
        if(!currentUser){
            session.set(constant.urlBeforeLogin, url);
            fn.redirect(config.loginUrl);
        }else{
            fn.next();
        }
    }
};

exports.after = function(form, fn){
    fn();
};