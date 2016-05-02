var express = require('express'); //引入express框架
var fs = require('fs'); //引入文件模块
var logger  = require('morgan');  //用户请求日志中间件   打印的nodejs 服务器接受到的请求的信息。
var session = require('express-session'); //会话管理中间件
var bodyParser = require('body-parser');  //请求内容解析中间件
var compression = require('compression');  //gzip压缩中间件
var errorhandler = require('errorhandler');  //错误处理中间件
var access = require('./middlewares/access');  //CORS处理中间件

module.exports = function(app, config) {

    var port = normalizePort(process.env.PORT || '3000');

    app.set('port', port);
    app.use(access.allowCORS);
    app.use(logger ('dev'));
    app.use(bodyParser.json());
    app.use(compression());
    app.use(session({
        secret: config.sessionSecret,
        resave: false,
        saveUninitialized: true
    }));

    if ('development' == app.get('env')) {
        app.use(errorhandler());
    }

    /**
     * Normalize a port into a number, string, or false.
     */
    function normalizePort(val) {
        var port = parseInt(val, 10);
        if (isNaN(port)) {
            // named pipe
            return val;
        }
        if (port >= 0) {
            // port number
            return port;
        }
        return false;
    }
};
