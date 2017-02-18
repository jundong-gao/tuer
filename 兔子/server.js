const express = require('express');
const bodyParser = require('body-parser');

var app = express();

app.use(express.static('wwwroot'));
app.use(bodyParser.urlencoded({extended : false}));

app.listen(3000,()=>{
    console.log('服务器运行...')
})