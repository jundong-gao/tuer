var mongodb = require('./db');


// 时间函数。返回各种时间格式的对象
function time(){
    var date = new Date()
    return {
        year : date.getFullYear(),
        month : date.getFullYear() + '-' + date.getMonth(),
        date : date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate(),
        hour : date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + '  ' + date.getHours(),
        minute : date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(),
        second : date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    }
}
// 创建一个User类，给User类添加方法。
function User(user){
    this.name = user.name;
    this.password = user.password;
    this.email = user.email;
    this.time = time().second;
}
// 将User类暴漏给外界，以便于外界使用。
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
                // 此处返回用户数据中的用户名
                callback(null,user[0]);
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
            // 此处通过name查询数据库
            collection.findOne({name:name},function(err,user){
                mongodb.close()
                if(err){
                    callback(err)
                }
                // 直接返回数据(用户的信息)
                callback(null,user);
            })
        })
    })
}