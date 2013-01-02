/**
 * Created with JetBrains WebStorm.
 * User: chengqiang
 * Date: 12-11-24
 * Time: 下午11:10
 * To change this template use File | Settings | File Templates.
 */

var config = require('../conf/config'),constant = require('../lib/constant'),logger = require('../lib/logger').getLogger();

exports.get = function(form, fn){
    var session = form.getSession();
    session.remove();
    fn.redirect('/login');
};