var mongodb = require('./db');

function Diary(name,mood,weather,location,diary){
    this.name = name;
    this.mood = mood;
    this.weather = weather;
    this.location = location;
    this.diary = diary;
}

module.exports = Diary;

Diary.prototype.save = function(callback){
    var date = new Date()
    var time = {
        date : date,
        year : date.getFullYear(),
        month : date.getFullYear() + '-' + (date.getMonth() + 1),
        day : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        second : date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
                + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + date.getSeconds()
    }

    var diary = {
        name : this.name,
        time : time,
        mood :this.mood,
        weather : this.weather,
        diary : this.diary,
        comments : [],
        pv : 0
    }

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
            collection.insert(diary,{safe :true},function(err){
                mongodb.close()
                if(err){
                    return callback(err)
                }
                return callback(null)
            })
        })
    })
}