/**
 * Module dependencies.
 */

var http = require('http');
var express = require('express');
var mongoose = require('mongoose');

var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

var connect = function() {
    //对于长时间运行的applictions的，它往往是谨慎启用KEEPALIVE。
    // 没有它，一段时间后，你可能会开始看没有理由的“connection closed”的错误。
    // 如果是这样的话，看这个后，你可能会决定启用KEEPALIVE
    var options = {
        server: {
            socketOptions: {
                keepAlive: 1
            }
        }
    };
    mongoose.connect(config.db, options);
};
connect();

var db = mongoose.connection;

/**
 * 连接成功
 */
db.on('connected', function () {
    console.log('数据库连接成功: ' + config.db);
});
/**
 * 连接异常
 */
db.on('error', function(err) {
    console.log('数据库连接异常:: ' + err);
});
/**
 * 连接断开
 */
db.on('disconnected', function() {
    console.log('数据库连接断开了. 正在尝试重新连接.');
    connect();
});

var app = express();
//配置路由基本设置（中间件设置）
require('./config/express')(app, config);
//配置路由（api）
require('./config/api')(app, config);
//监听端口设置
app.listen(app.get('port'));
