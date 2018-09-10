//类，mongoose使用的类，用户类
var mongoose = require("mongoose");

//这个模型返回一个构造函数
var hourseSchema = mongoose.Schema({
    "fangjianhao" : String,
    "leixing" : String,
    "weizhi" : String,
    "miaoshu" : String,
    "zhuangtai" : String,
});

//根据schema创建模型！
var build = mongoose.model("build",hourseSchema);

//暴露！
module.exports = build;