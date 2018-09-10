var formidable = require("formidable");
var check = require("../model/check")
var bulid = require("../model/build")
var url = require("url")
var jilu = require("../model/jilu")
exports.ruzhuxinxi = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        check.create({
            "zhengjian" : fields.zhengjian,
            "zhengjianhao" : fields.zhengjianhao,
            "xingming" : fields.xingming,
            "xingbie" : fields.xingbie,
            "leixing" : fields.leixing,
            "roomnum" : fields.roomnum,
            "price" : fields.price,
            "names" : fields.names,
            "shijian":fields.shijian
        },function (err,result) {
           res.json({"result":1})
        })
        jilu.create({
            "zhengjian" : fields.zhengjian,
            "zhengjianhao" : fields.zhengjianhao,
            "xingming" : fields.xingming,
            "xingbie" : fields.xingbie,
            "leixing" : fields.leixing,
            "roomnum" : fields.roomnum,
            "price" : fields.price,
            "names" : fields.names,
            "shijian":fields.shijian
        }),
        bulid.find({"fangjianhao":fields.roomnum,"leixing": fields.leixing}).exec(function(err,results){
            results[0].zhuangtai= "已入住";
            results[0].save(function (err,result) {
                // res.json({"result":result});
            })
        });
    })
}
exports.kehuxinxi = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 3;
    //寻找条目总数
    check.count({},function(err,count){
        check.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
exports.kehuxinxiALL = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 3;
    //寻找条目总数
    jilu.count({},function(err,count){
        jilu.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}

exports.ruzhujulu = function (req, res) {
    res.render("record");
}
exports.ruzhuxinxichaxun=function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        console.log(fields);
        check.find({"zhengjian":fields.type,"zhengjianhao":fields.zhengjianhao},function (err, result) {
            res.json({"result":result})
        })
    })
}

exports.tuifang = function (req, res) {
    res.render("checkout")
}
exports.ruzhuxinxishow = function (req, res) {
    res.render("reservations")
}