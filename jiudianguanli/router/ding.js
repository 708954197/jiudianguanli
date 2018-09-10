var room = require("../model/room")
var ding = require("../model/ding")
var path = require("path");
var url = require("url")
var formidable = require("formidable");
exports.showding = function (req, res) {
    res.render("yuding")
}
exports.jinruxinxi=function (req, res) {
    var sid = req.params.sid;
    room.find({"type":sid},function (err, result) {
        res.json({"result":result});
    })
}
//用户页面--添加订单
exports.AddUser = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        console.log(fields);
        ding.create({
            "zhengjianleixing":fields.zhengjianleixing,
            "zhengjianhao" : fields.zhengjianhao,
            "xingming" : fields.xingming,
            "sex" : fields.sex,
            "startdate" : fields.startdate,
            "enddate" : fields.enddate,
            "type":fields.type
        },function (err,result) {
            res.json({"results":1})
        })
    });
}

exports.xinxichuxian = function (req, res) {
    res.render("xinxi")
}
exports.suoyouxinxi = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    ding.count({},function(err,count){
        ding.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            console.log(results);
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}

exports.deletxin = function(req,res){
    var sid = req.params.zheng;
    ding.find({"zhengjianhao" : sid},function(err,results){
        if(err || results.length == 0){
            res.json({"result" : -1});
            return;
        }

        //删除
        results[0].remove(function(err){
            if(err){
                res.json({"result" : -1});
                return;
            }

            res.json({"result" : 1});
        });
    });
}
exports.chaxunruzhuxinxi = function (req, res) {
    var sid = req.params.zhengjianhao;
    ding.find({"zhengjianhao":sid},function (err, result) {
        if (err){
            res.json({"result":-1})
        } else{
            res.json({"result":result});
        }
    })
}

//退出登录
exports.tuichu = function (req, res) {
    req.session.login = null;
    res.json({"resul": 1})
}