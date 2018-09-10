var path = require("path");
var formidable = require("formidable");
var room = require("../model/room.js");
var url = require("url");


exports.showroom = function (req, res) {
    //使用这个页面需要登录！
    // if(!(req.session.login && req.session.type == "admin")){
    //     res.send("本页面需要登录，请<a href=/>登录</a>");
    //     return;
    // }
    res.render("room")
}
//得到所有房间
exports.getallRoom = function(req,res){
    var page = url.parse(req.url,true).query.page - 1 || 0;
    var pagesize = 5;
    room.count({},function(err,count){
        room.find({}).limit(pagesize).skip(pagesize * page).exec(function(err,results){
            res.json({
                "pageAmount" : Math.ceil(count / pagesize),
                "results" : results
            });
        });
    });
}
//添加房间
exports.addRoom = function(req,res){
    console.log("服务器收到了一个POST请求");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        //数据库持久
        room.addRoom(fields,function(result){
            res.json({"result" : result});
        });
    });
}
//更改房间信息
exports.changeRoom = function(req,res){
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        room.change(fields,function(){
            res.send("");
        });
    });
}
//删除房间
exports.deleteRoom = function(req,res){
    var sid = req.params.sid;
    console.log(sid)
    room.find({"type" : sid},function(err,results){
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

exports.showUpdate1 = function(req,res){
    //拿到学号
    var sid = req.params.sid;
    console.log(sid);
    // //直接用类名打点调用find，不需要再Student类里面增加一个findStudentBySid的方法。
    room.find({"type" : sid},function(err,results){
        console.log(results)
        if(results.length == 0){
            res.send("查无此人，请检查网址");
            return;
        }
        //呈递页面
        res.json({info: results[0]});
    });
}

//更改学生的Ajax接口，是post请求接口
exports.updateStudent1 = function(req,res){
    var sid = req.params.sid;
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields) {
        console.log(fields)
        //更改学生
        // console.log(fields);
        room.find({"type" :sid},function(err,results){
            var thestudent = results[0];
            console.log(results[0])
            //更改属性
            thestudent.type = fields.type;
            thestudent.name = fields.name;
            thestudent.area = fields.area;
            thestudent.num = fields.num;
            thestudent.food = fields.food;
            thestudent.newtword = fields.newtword;
            thestudent.tv = fields.tv;
            thestudent.price = fields.price;
            thestudent.numAll = fields.numAll;
            thestudent.surplus = fields.surplus;
            //持久化
            thestudent.save(function(err){
                if(err){
                    console.log(err);
                    res.json({"result" : -1});
                }else{
                    res.json({"result" : 1});
                }
            });
        });
    });
}
exports.check = function (req, res) {
    res.render("check");
}