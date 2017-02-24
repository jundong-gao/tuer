var mongodb = require('./db');

function Diary(name, mood, weather, location, diary) {
    this.name = name;
    this.mood = mood;
    this.weather = weather;
    this.location = location;
    this.diary = diary;
}

module.exports = Diary;

// 保存日记
Diary.prototype.save = function (callback) {
    var date = new Date()
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + '-' + (date.getMonth() + 1),
        day: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate(),
        second: date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' '
        + date.getHours() + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':' + date.getSeconds()
    }

    var diary = {
        name: this.name,
        time: time,
        mood: this.mood,
        location: this.location,
        weather: this.weather,
        diary: this.diary,
        comments: [],
        pv: 0,
        id: 0
    }

    // 打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err)
        }
        db.collection('diarys', function (err, collection) {
            if (err) {
                mongodb.close()
                return callback(err)
            }
            collection.insert(diary, { safe: true }, function (err) {
                mongodb.close()
                if (err) {
                    return callback(err)
                }
                return callback(null)
            })
        })
    })
}


 // 获取日记
Diary.getAll = function (name, callback) {
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err)
        }
        db.collection('diarys', function (err, collection) {
            if (err) {
                mongodb.close()
                return callback(err)
            }
            var query = {};
            if (name) {
                query.name = name;
            }
            collection.find(query).sort({ time: -1 }).toArray(function (err, docs) {
                mongodb.close()
                if (err) {
                    return callback(err)
                }
                callback(null, docs)
            })
        })
    });
}


// 获取一片日记
Diary.getOne = function (name, second, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);
        }
        //读取 posts 集合
        db.collection('diarys', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);
            }
            // 根据用户名、发表日期及文章名进行查询
            collection.findOne({
                "name": name,
                "time.second": second
            }, function (err, doc) {
                if (err) {
                    mongodb.close();
                    return callback(err);
                }
                if (doc) {
                    //每访问 1 次，pv 值增加 1
                    collection.update({
                        "name": name,
                        "time.second": second
                    }, {
                            $inc: { "pv": 1 }
                        }, function (err) {
                            mongodb.close();
                            if (err) {
                                return callback(err);
                            }
                        });
                    callback(null, doc);//返回查询的一篇文章
                }
            });
        });
    });
};