//类，mongoose使用的类，管理员类
var mongoose = require("mongoose");

//这个模型返回一个构造函数
var roomSchema = mongoose.Schema({
    "type" : Number,
    "name" : String,
    "area" : Number,
    "num" : Number,
    "food" : String,
    "newtword" : String,
    "tv" : String,
    'price':Number,
    "numAll" : Number,
    "surplus" : Number,
});

//静态方法：增加
roomSchema.statics.addRoom = function(json,callback){
    //增加学生的时候要先检查合法性，验证id是否被占用
    room.check(json.type,function(torf){
        if(torf){
            //没有被占用，就保存
            var r = new room(json);
            r.save(function(err){
                if(err){
                    callback(-2);  //服务器错误
                    return;
                }
                //发回1这个状态
                callback(1);
            });
        }else{
            //学号被占用了，返回-1
            callback(-1);
        }
    });
}
//验证房号是否存在
roomSchema.statics.check = function(type,callback){
    this.find({"type" : type} , function(err,results){
        //如果有相同的id返回false
        callback(results.length == 0);
    });
}
//静态方法：得到全部
roomSchema.statics.getAll = function(callback){
    this.find({}).sort({"type":1}).exec(function(err,results){
        callback(results);
    });
}
//静态方法：修改。
roomSchema.statics.change = function(newJSON){
    this.find({"_id" : newJSON["_id"]},function(err,results){
        results[0].type = newJSON.type;
        results[0].name = newJSON.name;
        results[0].num = newJSON.num;
        results[0].food = newJSON.food;
        results[0].newtword = newJSON.newtword;
        results[0].tv = newJSON.tv;
        results[0].price = newJSON.price;
        results[0].numAll = newJSON.numAll;
        results[0].surplus = newJSON.surplus;
        results[0].save();
    })
}

//静态方法：删除，接受一个_cid数组为参数，删除这个数组里面的所有项
roomSchema.statics.delete = function(arr,callback){
    var _arr = [];
    arr.forEach(function(item){
        _arr.push({"_id" : item});
    });

    //删除_id为这个，或者那个的。所以用$or引导！
    this.remove({$or : _arr},function(err,r){
        callback(err,r.n);
    });
};
//查询方法
roomSchema.statics.search = function(word,callback){
    console.log("我是Course类，我收到了模糊查询次" + word);
    this.find(
        {
            "$or" : [
                {"name" : new RegExp(word)},
                {"food" : new RegExp(word)},
                {"newtword" : new RegExp(word)}
            ]
        }
    ).sort({"type":1}).exec(
        function(err,results){
            callback(results);
        }
    );
}
//根据schema创建模型！
var room = mongoose.model("room",roomSchema);

//暴露！
module.exports = room;