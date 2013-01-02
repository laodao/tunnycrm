var path = require('path'),
    config = require(path.resolve('.')+'/conf/config'),
	log4js = require('log4js');

var logPath = path.join(config.logPath);
log4js.configure({
    appenders: [
        { type: 'console' },
        { type: 'file', filename: logPath, category: 'cheese' }
    ]
});
//log4js.addAppender(log4js.consoleAppender());

exports.getLogger = function (){
	var logger = log4js.getLogger('crm');
	logger.setLevel(config.logLevel);
	return logger;
};
