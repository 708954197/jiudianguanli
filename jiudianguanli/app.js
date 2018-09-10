//引用模块
var express = require("express");
var session = require('express-session')
var mongoose = require("mongoose");
//路由
var common_router = require("./router/common_router.js");
var admin_router = require("./router/admin_router.js");
var router = require("./router/router");
var bulid = require("./router/bulid");
var check = require("./router/check");
var ding = require("./router/ding");
//创建APP
var app = express();
//mongoose在链接数据库，此时这两条语句要写在app.js中而不是每个模块中
//因为mongoose底层是在帮我们监听是不是在连接数据。在需要使用mongoose实例的地方，请重新require它。而不要connect它！
mongoose.connect('mongodb://localhost:27017/diancai');

//设置默认模板引擎
app.set("view engine","ejs");


//设置session
//使用一个中间件，就是session中间件。这个中间件必须排在第一个
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'xuanxiukebaomingxitong', //加密字符串，我们下发的随机乱码都是依靠这个字符串加密的
    resave: false,
    saveUninitialized: true
}));

app.use(express.static("public"))
app.use("/uploads"    ,express.static("uploads"));

//路由清单
app.get ("/"                            ,common_router.showIndex);//首页
app.post("/checklogin"                  ,common_router.checklogin);//Ajax接口，检查登录是否成功，能够返回{result:-2}
app.get ("/admin"                       ,admin_router.showAdmin); //管理员管理面板
app.get("/reg"                          ,common_router.showReg); //普通人注册
app.get("/checkuserexist"               ,common_router.checkuserexist);//账号是不是能使用
app.post("/doreg"                       ,common_router.doreg);//用户名注册
app.get("/adminIndex"                   ,common_router.AdminIndex);//管理员登录显示的主页
app.get("/roomIndex"                    ,router.showroom);//进入添加房间类别
app.get ("/room"                        ,router.getallRoom);//Ajax的接口，得到所有房间
app.post("/room/add"                    ,router.addRoom);//增加房间
app.post("/room/ensure"                 ,router.changeRoom);//Ajax的接口，修改房间
app.delete("/room/:sid"                 ,router.deleteRoom); //Ajax的接口，删除房间
app.post('/room/:sid'	                ,router.showUpdate1);//呈递更改学生表单
app.post('/student/:sid'	            ,router.updateStudent1);	//更改数据信息

//修改密码
app.get("/change"                       ,common_router.change);//显示修改的主页
app.post("/change/:sid"                 ,common_router.xiugai);//修改密码

//入住管理
app.get("/check"                        ,router.check);//进入入住页面

//添加房间
app.get("/build"                        ,bulid.buildshow);//显示添加房间信息
app.get('/allleibie'                    ,bulid.AllLeiBieAdmin);//所有房类管理
app.get('/fangjianguanli/all'           ,bulid.AllAdminFangjianGuanli);//--所有房间管理
app.post('/fangjianguanli'              ,bulid.AddAdminFangjianGuanli);//添加房间管理
app.delete('/fangjianguanli/:sid'       ,bulid.delAdminFangjianGuanli);   //删除房间管理
app.get('/fangjianguanli/updata'        ,bulid.updataAdminFangjianGuanli);//显示更改房间管理页
app.post('/fangjianguanli/change'       ,bulid.changeAdminFangjianGuanli);//更改房间管理
app.post('/fangjianguanli/changezt'     ,bulid.changeAdminZt);            //更改房间状态


//查询房间
app.get("/query"                        ,bulid.chaxun);//查询房间信息
app.post("/cha/:fangjianhao"            ,bulid.chaxunfangjian);//查询房间信息
app.post("/chahao/:leixing"             ,bulid.chahao);//查询房间信息
app.post("/ruzhuxinxi"                  ,check.ruzhuxinxi);
app.get('/kehuxinxi/all'                ,check.kehuxinxi);//--所有房间管理
app.get('/kehuxinxiALL/all'             ,check.kehuxinxiALL);//--所有房间管理

//房间入住
app.get("/record"                       ,check.ruzhujulu)
app.post("/ruzhuxinxichaxun"            ,check.ruzhuxinxichaxun);//入住信息查询

//退房
app.get("/checkout"                     ,check.tuifang);//推出房间
app.post("/tuifang"                     ,bulid.tuichufang);//推房间
app.get('/fangjianguanlitui/all'        ,bulid.AllAdminFangjianGuanlitui);//已定房间

//用户预定房间
app.get("/yuding"                       ,ding.showding)//显示预定页面
app.post("/yuding/:sid"                 ,ding.jinruxinxi)
app.post('/yonghuxinxieru'              ,ding.AddUser);
app.get("/xinxi"                        ,ding.xinxichuxian);
app.get ("/yudingxinxi"                 ,ding.suoyouxinxi);//得到所有房间
app.post("/deletxin/:zheng"             ,ding.deletxin);

//预定入住
app.get("/reservations"                 ,check.ruzhuxinxishow);//入住信息
app.post("/chaxunruzhuxinxi/:zhengjianhao" ,ding.chaxunruzhuxinxi);
app.get("/tui"                          ,ding.tuichu);//退出登录
//监听
app.listen(3001);