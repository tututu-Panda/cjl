const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const express = require('express');
const api = require('./api');
const visiter = require('./visiter');
const app = express();

//跨域
app.use(cors());
app.use(express.json({limit: '5mb'}));

app.use(bodyParser.json());
//当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.urlencoded({extended: false}));

// session引入
app.use(session({
        secret: '123456',
        resave: true,
        saveUninitialized: true
}));



// 后台管理api
app.use(api);
// 游客浏览api
app.use(visiter);

// 监听8088端口
app.listen(8088);
console.log('success listen…………');
