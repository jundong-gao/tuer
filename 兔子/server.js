const express = require('express');
const bodyParser = require('body-parser');
// 引入settings.js文件
var settings = require('./settings');
// 引入flash模块
var flash = require('connect-flash');
// 支持会话
var session = require('express-session');
// 将会话保存在session中
var MongoStore = require('connect-mongo')(session);


var app = express();

app.use(express.static('wwwroot'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: settings.cookieSecret,
    key: settings.db,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 30 },
    store: new MongoStore({
        url: 'mongodb://localhost/tuer'
    })
}))

// 请求的路由
var routes = require('./routes/index')
// 把app传到路由文件中使用
routes(app)


app.listen(3000, () => {
    console.log('服务器运行...')
})