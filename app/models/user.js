/*
 * user model
 */

var bcrypt = require('bcrypt');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//定义一个Schema  schema是mongoose里会用到的一种数据模式，可以理解为表结构的定义
var UserSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, default: ''},
    passwordHash: {type: String, default: ''},
    nickname: {type: String, default: ''},
    avatar: {type: String, default: ''},
    site: {type: String, default: ''},
    info: {type: String, default: ''},
    contributeCount: {type: Number, default: 0},
    createdAt: {type: Date, default: Date.now},
    activated: {type: Boolean, default: false}
});

UserSchema
    .virtual('password')
    .set(function (password) {
        var salt = bcrypt.genSaltSync(10);
        this.passwordHash = bcrypt.hashSync(password, salt);
    })
    .get(function () { return this.passwordHash; });

UserSchema.methods = {
    auth: function (password) {
        return bcrypt.compareSync(password, this.passwordHash);
    }
};

UserSchema.index({email: 1});

//model是由schema生成的模型，可以对数据库的操作
//我们对上面的定义的user的schema生成一个User的model并导出
mongoose.model('User', UserSchema);
