//类，mongoose使用的类，用户类
var mongoose = require("mongoose");

//这个模型返回一个构造函数
var userdingdanSchemas = mongoose.Schema({
    "zhengjianleixing":String,
    "zhengjianhao" : String,
    "xingming" : String,
    "sex" : String,
    "startdate" : String,
    "enddate" : String,
    "type":String
});

//根据schema创建模型！
var ding = mongoose.model("ding",userdingdanSchemas);

//暴露！
module.exports = ding;