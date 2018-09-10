var path = require("path");
var xlsx = require('node-xlsx');
var formidable = require("formidable");
var Admin = require("../model/admin.js")
// var Student = require("../model/Student.js")
// var Course = require("../model/Course.js")
var crypto = require("crypto");
var fs = require("fs");
// var nodeExcel = require('excel-export');
var url = require("url");



//管理员面板
exports.showAdmin = function(req,res){
    //使用这个页面需要登录！
    if(!(req.session.login && req.session.type == "admin")){
        res.send("本页面需要登录，请<a href=/>登录</a>");
        return;
    }
    res.sendFile(path.join(__dirname , "../views/admin.html"));
}

