//本文件就是roter，是控制器
var path = require("path");
var formidable = require("formidable");
var Admin = require("../model/admin.js")
var user = require("../model/user.js");//负责注册部分
var crypto = require("crypto");
var fs = require("fs");
var url = require("url")

exports.AdminIndex = function(req,res){
    res.render("adminIndex")
}
//显示首页，就是/这个路由，它有两个作用，如果学生用户登录了，显示选课表单了，如果没有登录，就显示登录界面
exports.showReg = function(req,res){
    res.render("reg")
}
exports.showIndex = function(req,res){
    if(req.session.login && req.session.type == "kehu"){
        //登录成功要做的业务
        res.render("userindex",{
            "xingming" : req.session.xingming,
        });
    }else{
        //呈递没有登录表单
        res.sendFile(path.join(__dirname , "../views/index.html"));
    }
}

//验证登录
exports.checklogin = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //得到用户输入的表单数据，用户名和密码：
        console.log(fields)
        var username = fields.username;
        var password = fields.password;

        if(err){
            //-1表示数据库错误
            res.json({"result":-1});
            return;
        }

        if(!username || !password){
            console.log(-4);
            //-4表示没有填写
            res.json({"result":-4});
            return;
        }
        //根据用户输入的用户名是数字还是字母来判断是学生还是管理员
        if(Number.isInteger(Number(username))){
            //是一个数字，我们倾向于他是一个学生
            console.log("学生",username,password);
            user.findBySid(username,function(err,results){
                // console.log(results);
                if(err){
                    res.json({"result" : -1});
                    return;
                }
                //用户名不存在
                if(results.length == 0){
                    res.json({"result" : -2});
                    return;
                }
                //判断密码是否正确，将用户输入的密码加密只有和results[0].password进行比较即可
                password = crypto.createHmac('sha256', password).digest('hex');
                // console.log(password)
                if(password == results[0].mima){
                    //1就是登陆成功
                    //登录成功，下发session
                    req.session.xingming = results[0].yonghuming;
                    req.session.type = "kehu";
                    req.session.login = true;
                    res.json({"result":1 , "type" : "kehu"});
                }else{
                    //-3就是密码错误！
                    res.json({"result":-3});
                }
            });
        }else{
            //用户名不是一个数字，此时我们倾向于他是管理员
            //首先检查这个人是不是存在
            Admin.findByUsername(username,function(err,results){
                if(err){
                    //-1表示数据库错误
                    res.json({"result":-1});
                    return;
                }
                if(results.length == 0){
                    //用户名不存在！
                    res.json({"result":-2});
                    return;
                }
                //直接检查密码是否输入正确！！
                var theadmin = results[0];
                //加密密码
                var sha256 = crypto.createHash("sha256");
                password = sha256.update(password).digest("hex").toString();
                if(theadmin.password == password){
                    //登录成功，下发session
                    req.session.username = username;
                    req.session.type = "admin";
                    req.session.login = true;

                    res.json({"result":1 , "type" : "admin"});
                }else{
                    res.json({"result":-3});
                }
            });
        }
    });
}

//验证用户名是否存在
exports.checkuserexist = function(req,res,next){
    var queryobj = url.parse(req.url,true).query;
    if(!queryobj.yonghuming){
        res.send("请提供yonghuming参数！");
        return;
    }
    //查询数据库中，用户是否存在，如果存在输出-1，不存在输出0
    user.findUserByName(queryobj.yonghuming,function(err,doc){
        if(doc){
            res.json({"result" : -1});
        }else{
            res.json({"result" : 0});
        }
    });
}
//执行注册，在真正执行注册的时候也要后台验证一下用户名是否占用
exports.doreg = function(req,res){
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields) {
        var yonghuming = fields.yonghuming;
        var mima = fields.mima;
        //在提交的时候再次检查用户名是否重复了
        user.findUserByName(yonghuming,function(err,doc){
            if(doc){
                //-1就是用户名存在
                res.json({"result" : -1});
                return;
            }
            //在数据库中添加一个user
            user.adduser(yonghuming,mima,function(err,doc){
                if(err){
                    //-2就是服务器错误
                    res.json({"result" : -2})
                    return;
                }
                //注册成功！！
                req.session.login = 1;
                req.session.yonghuming = yonghuming;

                res.json({"result" : 1})
            });
        });
    });
}

exports.change = function(req,res){
    res.render("change")
}
exports.xiugai = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        user.find(sid,function(err,results){
            var thestudent = results[0];
            thestudent.mima = crypto.createHmac('sha256', fields.password).digest('hex');
            thestudent.save(function(err){
                if(err){
                    console.log(err);
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        })
    })
}
//显示404
exports.show404 = function(req,res){
    res.status(404).send("没有这个页面，请检查网址！");
}