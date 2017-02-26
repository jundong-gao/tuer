
// 引入mongodb 
var mongodb = require('../models/db')
// 引入User类
var User = require('../models/user');
// 加密模块
var crypto = require('crypto');
// 引入diary类
var Diary = require('../models/diary')
// multer模块
var multer = require('multer')
// 引入留言
var Comment = require('../models/comment')


// 配置multer，上传头像使用
var storage = multer.diskStorage({
	destination : function (req,file,cb) {
		cb(null,'./wwwroot/uploads')
    },
	filename : function (req,file,cb) {
		// cb(null,file.originalname)
		// var filename = req.session.user.name + new Date().getTime() + file.originalname;
        var filename = file.originalname;
		cb(null,filename)
    }
})
var upload = multer({storage:storage})




// 权限函数
function checkLogin(req,res,next){
	if(!req.session.user){
		res.status(200).json({
            code : 'error',
            message : '还未登陆，请先登陆'
        })
        return
	}
	next()
}
function checkNotLogin(req,res,next){
	if(req.session.user){
		res.status(200).json({
            code:'error',
            message : '请不要重复登陆'
        })
        return
	}
	next()
}



module.exports = function (app) {
    // 注册
    app.post('/reg', function (req, res) {

        // 将数据整理  并放到User对象中
        var name = req.body.username;
        var password = req.body.password;
        var email = req.body.email;
        //此处对密码进行加密
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');

        var newUser = new User({
            name: name,
            password: password,
            email: email,
            time : new Date()
        })
        //检查一下用户是否存在
        User.get(newUser.name, function (err, user) {
            if (err) {
                res.status(200).json({ code: 'error', message: '数据库错误' });
                return;
            }
            // 如果用户名已经存在
            if (user) {
                res.status(200).json({ code: 'error', message: '用户名已经存在' })
                return;
            }
            // 可以正常存放在数据库中
            newUser.save(function (err, user) {
                console.log('save')
                if (err) {
                    console.log(3)
                    res.status(200).json({ code: 'error', message: '数据库错误' })
                }
                req.session.user = newUser;
                res.json({
                    code : 'success',
                    message : '注册成功',
                    user:req.session.user
                })
            })
        })
    })


    // 登陆
    app.post('/login',checkNotLogin)
    app.post('/login',(req,res)=>{
        var md5 = crypto.createHash('md5');
        var password = md5.update(req.body.password).digest('hex');

        User.get(req.body.username,(err,user)=>{
            if(!user){
                res.status(200).json({code:'error',message:'该用户名不存在'});
                return;
            }
            console.log(user.password + '===' + password)
            //检查密码是否一致
            if(user.password != password){
                res.status(200).json({code:'error',message:'密码错误'});
                return;
            }
            // 将用户信息存到session中
            req.session.user = user;
            res.status(200).json({
                code:'success',
                message:'登陆成功',
                user:req.session.user
            })
        })
    })


    // 写日记，发布日记
    app.post('/diary',checkLogin)
    app.post('/diary',function(req,res){
        // 获取当前用户名
        var currentUser = req.session.user.name;
        console.log('当前用户',req.session.user.name)
        console.log(req.body.diary)
        var newDiary = new Diary(currentUser,req.body.mood,req.body.weather,req.body.location,req.body.diary);
        newDiary.save(function(err){
            if(err){
                res.status(200).json({code:'error',message:'数据库错误'})
            }
            res.status(200).json({code:'success',message:'发布成功'})
        })
    })

    // 在首页显示日记
    app.get('/allDiary',(req,res)=>{
        mongodb.open(function(err,db){
            if(err){
                // 错误提示
            }
            db.collection('diarys',function(err,collection){
                if(err){
                    mongodb.close()
                    // 错误提示
                }
                
                collection.find().sort({time:-1}).toArray(function(err,docs){
                    mongodb.close()
                    if(err){
                        // 错误
                    }
                    res.status(200).json({data : docs})
                })
            })
        });
    })

    //退出功能
    app.get('/logout',checkLogin)
    app.get('/logout',function(req,res){
        req.session.user = null;
        res.status(200).json({
            code : 'success',
            message : '退出成功'
        })
    })

    // 判断是否有用户登录
    app.get('/12',function(req,res){
        res.status(200).json({
            
            code : '我是神',
            user : req.session.user
        })
    })

    // 上传头像
    app.post('/upload',checkLogin)
	app.post('/upload', upload.array('pic',2),function (req,res) {
        res.status(200).json({
            code : 'success',
            message : '上传成功'
        })
    })

    // 未登录的首页
    app.get('/shouye',function(req,res){
        mongodb.open(function(err,db){
            if(err){
                // 错误提示
            }
            db.collection('diarys',function(err,collection){
                if(err){
                    mongodb.close()
                    // 错误提示
                }
                
                collection.find(null,{limit:10}).sort({time:-1}).toArray(function(err,docs){
                    mongodb.close()
                    if(err){
                        // 错误
                    }
                    res.status(200).json({data : docs})
                })
            })
        });
    })


    // 日记详情
    app.get('/diarys/:name/:second',function(req,res){
        // res.status(200).json({code:'success'})
        Diary.getOne(req.params.name,req.params.second,function(err,diary){
            if(err){
                //
            }
            res.status(200).json({code:'success',data:diary , user : req.session.user})
        })
    })

    // 留言
    app.post('/comment/:name/:second',function(req,res){
        var date = new Date(),
            time = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());

        var comment = {
            name : req.params.name,
            second : req.params.second,
            time : time,
            content:req.body.content,
            user: req.session.user
        }
        console.log('comment',comment)
        var newComment = new Comment(req.params.name,req.params.second,comment);

        newComment.save(function(err){
            if(err){
                res.status(200).json({code:'error',message:'数据库错误'})
                return
            }
            res.status(200).json({code:'success',message:'留言成功'})
        })
    })


    // 显示某个作者的全部日记
    app.get('/:name',function(req,res){
        Diary.getAll(req.params.name,function(err,diary){
            if(err){
                res.status(200).json({code :'error' , message : '数据库错误'})
            }
            res.status(200).json({code:'success', data:diary , user : req.session.user})
        })
    })


    // 获取当前用户的所有日记
    app.get('/user/index',function(req,res){
        console.log(req.session.user.name)
        Diary.getAll(req.session.user.name,function(err,diary){
            if(err){
                res.status(200).json({code :'error' , message : '数据库错误'})
            }
            res.status(200).json({code:'12', data:diary , user : req.session.user})
        })
    })  
}
