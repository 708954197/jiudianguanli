//引用mongoose
var mongoose = require('mongoose');

//加密模块
var crypto = require('crypto');

//定义用户的schema
var userSchema = mongoose.Schema({
    //用户名
    yonghuming: String,
    //密码
    mima : String
});
//定义用户的model
var user = mongoose.model('user', userSchema);
//通过名字寻找用户
exports.findUserByName = function(yonghuming , callback){
    user.findOne({"yonghuming" : yonghuming} , function(err,doc){
        callback(err,doc);
    });
};
//添加user
exports.adduser = function(yonghuming,mima,callback){
    //先给密码加密
    var jiamidemima = crypto.createHmac('sha256', mima).digest('hex');
    //向数据库保存
    user.create({"yonghuming" : yonghuming , "mima" : jiamidemima},function(err,doc){
        callback(err,doc)
    });
};
exports.find = function(sid,callback){
    user.find({"yonghuming":sid},function (err, result) {
        callback(err,result);
    })
}
//追加属性
exports.addShuxing = function(yonghuming,k,v,callback){
    user.findOne({"yonghuming":yonghuming},function(err,doc){
        if(err){
            return;
        }
        if(!doc){
            return;
        }
        //有责跟新无则增加
        doc[k] = v;
        doc.save(callback);
    });
};


//得到某个属性
exports.getK = function(yonghuming,k,callback){
    user.findOne({"yonghuming":yonghuming},function(err,doc){
        callback(err,doc[k]);
    });
};
exports.findBySid = function(sid,callback){
    user.find({"yonghuming" : sid} , function(err,results){
        callback(err,results);
    })
}

