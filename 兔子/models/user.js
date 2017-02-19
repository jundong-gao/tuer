var mongodb = require('./db');

function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.time = new Date()
}

module.exports = User;

// 保存用户
User.prototype.save = function(callback){
    var user = {
        name: this.name,
        password : this.password,
        email : this.email,
        zhuceTime: this.time
    }
    //打开数据库
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            // 插入数据
            collection.insert(user,{safe:true},function(err,user){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                callback(null,user[0]);// 返回用户数据中的用户名
            })
        })
    })
}

// 查询用户
User.get = function(name,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err)
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close()
                return callback(err)
            }
            collection.findOne({name:name},function(err,user){
                mongodb.close()
                if(err){
                    callback(err)
                }
                callback(null,user) // 直接返回数据，用户信息
            })
        })
    })
}