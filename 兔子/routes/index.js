
// 引入User类
var User = require('../models/user');
// 加密模块
var crypto = require('crypto');




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
}
