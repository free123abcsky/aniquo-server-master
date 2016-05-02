var crypto = require('crypto');
var request = require('request');
var env = process.env.NODE_ENV || 'development';
var config = require('../config')[env];

module.exports = function(req, res, next) {
    var incode = req.body.incode;

    if (!incode) {
        return res.status(403).send({
            error: '邀请码不能为空'
        });
    }

    var md5 = crypto.createHash('md5');  //生成口令的散列值  crypto模块功能是加密并生成各种散列

    //Node.js提供的加密模块功能非常强大，Hash算法就提供了MD5、sha1、sha256等，根据需要去使用
    //update(data, [input_encoding])方法，可以通过指定的input_encoding和传入的data数据更新hash对象，input_encoding为可选参数，没有传入则作为buffer处理 （input_encoding可为'utf-8'、'ascii'等）
　　//digest([encoding])方法，计算数据的hash摘要值，encoding是可选参数，不传则返回buffer (encoding可为 'hex'、'base64'等)；当调用digest方法后hash对象将不可用；
    var sign = md5.update(config.incode.APISecret + incode).digest('hex');



    request({
        method: 'PUT',
        url: config.incode.occupy,
        json: true,
        qs: {
            sign: sign,
            api_key: config.incode.APIKey,
            code: incode
        }
    }, function(err, response, body) {

        if (err) {
            return res.status(500).send({
                error: '网络错误，请稍候再试'
            });
        }

        if (body.error_code === 0) {
            next();
        } else {
            console.log(body);
            return res.status(403).send({
                error: '邀请码无效'
            });
        }

    });

};
