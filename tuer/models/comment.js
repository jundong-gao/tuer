

var mongodb = require('./db');


function Comment(name,second,comment){
    this.name = name;
    this.second =second;
    this.comment = comment;
}

module.exports = Comment;

// 存储一条信息

Comment.prototype.save = function(callback){
    var name = this.name,
        second = this.second,
        comment = this.comment;

    // 打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('diarys',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            // 通过名字和时间查找一篇文章
            collection.update({
                "name" : name,
                "time.second" : second
            },{
                $push : {"comments":comment}
            },function(err){
                mongodb.close();
                if(err){
                    return callback(err)
                }
                callback(null)
            })
        })
    })
}