var room = require("../model/room.js");
var path = require("path");
var formidable = require("formidable");
var build = require("../model/build")
var url = require("url");
var check = require("../model/check")
exports.buildshow = function (req, res) {
    res.render("build");
}
exports.AllLeiBieAdmin = function(req,res){
    room.find({}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
//管理员页面--所有房间管理
exports.AllAdminFangjianGuanli = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    //寻找条目总数
    build.count({},function(err,count){
        build.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}
//管理员页面--添加房间管理
exports.AddAdminFangjianGuanli = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        build.create({
            "fangjianhao" : fields.fangjianhao,
            "leixing" : fields.leibie,
            "weizhi" : fields.weizhi,
            "miaoshu" : fields.miaoshu,
            "zhuangtai" : fields.zhuangtai
        },function (err,result) {
            res.redirect('/build')
        })
    });
}
//管理员面板--删除房间管理
exports.delAdminFangjianGuanli = function(req,res){
    var sid = req.params.sid;
    build.find({"fangjianhao" : sid},function(err,results){
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
//管理员面板---显示更改房间管理页
exports.updataAdminFangjianGuanli = function(req,res){
    var sid = url.parse(req.url,true).query.sid;
    build.find({"fangjianhao":sid}).exec(function(err,results){
        res.json({
            "results" : results
        });
    });
}
//管理员页面--更改房间管理
exports.changeAdminFangjianGuanli = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        build.find({"fangjianhao":fields.fangjianhao}).exec(function(err,results){
            results[0].fangjianhao = fields.fangjianhao;
            results[0].leixing = fields.leixing;
            results[0].weizhi = fields.weizhi;
            results[0].miaoshu = fields.miaoshu;
            results[0].zhuangtai = fields.zhuangtai;
            results[0].save(function (err,result) {
                res.json("修改成功");
            })
        });
    });
}
//管理员页面--更改房间状态
exports.changeAdminZt = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        build.find({"fangjianhao":fields.fangjianhao}).exec(function(err,results){
            results[0].fangjianhao = fields.fangjianhao;
            results[0].leixing = results[0].leixing;
            results[0].weizhi = results[0].weizhi;
            results[0].miaoshu = results[0].miaoshu;
            results[0].zhuangtai = "预定";
            results[0].save(function (err,result) {
                res.json({"results":1,"leixing":results[0].leixing})
            })
        });
    });
}
exports.chaxun = function (req, res) {
    res.render("query")
}
exports.chaxunfangjian = function (req, res) {
    var fangjianhao = req.params.fangjianhao;
    build.find({"fangjianhao":fangjianhao},function (err, result) {
        console.log(result);
        if (err){
            res.json({"result":-1})
        } else{
            res.json({"result":result});
        }
    })
}
exports.chahao = function (req, res) {
    var leixing = req.params.leixing;
    build.find({"leixing":leixing},function (err, result) {
        res.json({"results":result});
    })
}

exports.tuichufang = function (req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        console.log(fields);
        build.find({"fangjianhao":fields.num,"leixing":fields.sid}).exec(function(err,results){
            results[0].zhuangtai = "未入住";
            results[0].save(function (err,result) {
                // res.json({"results":1})
                check.find({"leixing" : fields.sid,"roomnum":fields.num},function(err,results){
                    console.log(results)
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
            })
        });

    });
}
//管理员页面--所有房间管理
exports.AllAdminFangjianGuanlitui = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    //寻找条目总数
    build.count({},function(err,count){
        build.find({"zhuangtai":"已入住"}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            results
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });

}
