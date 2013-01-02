/**
 * @author lonun@gmail.com
 */
var os = require('os');

/********************************************************************
 * 全局配置
 ********************************************************************/
exports.staticFileDir = 'static';
exports.defaultPort = 6060;
exports.templateSuffix = {"jade":".jade","ejs":"html"};
exports.templateType = "ejs";
exports.templatePath = "views";
exports.baseDir = process.cwd();
exports.basePath = '';
exports.staticDir = '/static';
exports.uploadDir = '/upload';
exports.indexPage = '/site';
exports.err404Page = '/html/404.html';
exports.err500Page = '/html/500.html';
exports.env = 'dev';
exports.fileSeprator = os.platform()==='win32' ? '\\' : '/';

/********************************************************************
 * 数据库配置
 ********************************************************************/
var _dataSource = {
    dev:{
            "host": "127.0.0.1",
            "database": "crm",
            "username": "root",
            "password": "123"
        },

    test:{
            "host": "127.0.0.1",
            "database": "album",
            "username": "",
            "password": ""
        },

    prd:{
            "host": "127.0.0.1",
            "database": "album",
            "username": "",
            "password": ""
        }
};
exports.dbType = 'mysql';
exports.dataSource = _dataSource[exports.env];

/********************************************************************
 * websocket配置
 ********************************************************************/
exports.webSocket = 'off';
exports.socketConfig = [
    {
        namespace  : '/socket/test', //响应的url
        handler    : 'socket/test'
    },
    {
        namespace  : '/privateChat',
        handler     : 'privateChat'
    }
];

/********************************************************************
 * session配置
 ********************************************************************/
exports.sessionConfig = {
    sessionTimeout : 20,
    sessionType    : 'local'
};
exports.sessionDSConfig = {
    port  : 6379,
    host  : '127.0.0.1',
    max   : 1000,
    min   : 5,
    init  : 10,
    step  : 10
};

/********************************************************************
 * 日志配置
 ********************************************************************/
exports.logPath = 'd:/logs/crm.log';
exports.logLevel = "INFO";

/********************************************************************
 * 安全认证配置
 ********************************************************************/
exports.authorize = 'on';
exports.loginUrl = '/login';
exports.noRight = '/noRight.html';
exports.noId = "/noId.html";
exports.logoutUrl = '/logout';
exports.currentUser = 'CURRENT_USER';
exports.userID = "userID";

/********************************************************************
 * 拦截器配置
 ********************************************************************/
