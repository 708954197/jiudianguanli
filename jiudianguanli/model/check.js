//类，mongoose使用的类，用户类
var mongoose = require("mongoose");

//这个模型返回一个构造函数
var hourseSchem = mongoose.Schema({
    "zhengjian" : String,
    "zhengjianhao" : String,
    "xingming" : String,
    "xingbie" : String,
    "leixing" : String,
    "roomnum" : String,
    "price" : String,
    "names" : String,
    "shijian":String
});

//根据schema创建模型！
var check = mongoose.model("check",hourseSchem);

//暴露！
module.exports = check;