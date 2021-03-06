"use strict";
const db = require('./db');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");
const path = require('path');

/**
 * 前台用户api
 */


// 注册
router.post('/api/signUp', (req, res) => {
    //是否重名
    db.User.find({ name: req.body.name }, (err, docs) => {
        if (err) {
            res.send(err);
            return
        }
        if (docs.length > 0) {
            res.send({ 'status': 0, 'msg': '用户名已注册' });
        } else {
            db.User.find({ nickName: req.body.nickName }, (err, docs) => {
                if (err) {
                    res.send(err);
                    return
                }
                if (docs.length > 0) {
                    res.send({ 'status': 0, 'msg': '昵称已注册' });
                } else {
                    let newUser = new db.User({
                        name: req.body.name,
                        password: req.body.password,
                        nickName: req.body.nickName,
                        avatar: null,
                        // type: req.body.type
                        type: 2//1为管理员，2为游客,写死，新建管理员数据库直接改
                    });
                    newUser.save(function (err) {
                        if (err) {
                            res.send(err);
                        } else {
                            res.send({ 'status': 1, 'msg': '注册成功' });
                        }
                    })
                }
            })
        }
    })
})

//登录
router.post('/api/signIn', (req, res) => {
    db.User.find({ name: req.body.name, password: req.body.password }, (err, docs) => {
        if (err) {
            res.send(err);
            return
        }
        if (docs.length > 0) {
            let content = { name: req.body.name }; // 要生成token的主题信息
            let secretOrPrivateKey = "123456"; // 这是加密的key（密钥）
            let token = jwt.sign(content, secretOrPrivateKey, {
                expiresIn: 60 * 60 * 24  // 24小时过期
            });
            req.session.type = docs[0]["type"];
            docs[0].token = token;
            db.User(docs[0]).save(function (err) {
                if (err) {
                    res.status(500).send();
                    return
                }
                res.send({ 'status': 1, 'msg': '登陆成功','_id':docs[0]._id, 'token': docs[0].token, 'user_name': docs[0]["name"], 'type': docs[0]["type"], 'nickName': docs[0]["nickName"], 'avatar': docs[0]["avatar"] })
                // console.log("tttt"+ req.session.type)
            })
        } else {
            res.send({ 'status': 0, 'msg': '登录失败' });
        }
    })
});

//检测token
router.post('/api/checkUser', (req, res) => {
    db.User.find({ name: req.body.user_name, token: req.body.token }, (err, docs) => {
        if (err) {
            res.send(err);
            return
        }
        if (docs.length > 0) {
            let token = req.body.token; // 从body或query或者header中获取token
            let secretOrPrivateKey = "123456"; // 这是加密的key（密钥）

            jwt.verify(token, secretOrPrivateKey, function (err, decode) {
                if (err) {  //  时间失效的时候/ 伪造的token
                    res.send({ 'status': 0 });
                } else {
                    res.send({ 'status': 1, 'type': docs[0]["type"], 'user_name': docs[0]["name"], 'avatar': docs[0]["avatar"], 'nickName': docs[0]["nickName"] });
                }
            })
        } else {
            res.send({ 'status': 0 });
        }
    })
});


// 退出
router.post('/api/signOut', (req, res) => {
    db.User.find({ name: req.body.name, token: req.body.token }, (err, docs) => {
        if (err) {
            return
        }
        if (docs.length > 0) {
            docs[0].token = '';
            db.User(docs[0]).save(function (err) {
                if (err) {
                    res.status(500).send();
                    return
                }
                req.session.type = null;
                res.send({ 'status': 1, 'msg': '退出成功' })
            })
        } else {
            res.send({ 'status': 0, 'msg': '退出失败' })
        }
    })
})
// 用户信息更新
router.post('/api/updateUser', (req, res) => {
    db.User.find({ name: req.body.name, token: req.body.token }, (err, docs) => {
        if (err) {
            return
        }
        if (docs.length > 0) {
            if (req.body.avatar == "null" || req.body.avatar.indexOf("avatar") > -1) {//不需更新图片
                docs[0].nickName = req.body.nickName;
                docs[0].avatar = req.body.avatar;
                db.User(docs[0]).save(function (err) {
                    if (err) {
                        res.status(500).send()
                        return
                    }
                    res.send({ 'status': 1, 'msg': '更新成功', 'user_name': docs[0]["name"], 'type': docs[0]["type"], 'nickName': docs[0]["nickName"], 'avatar': docs[0]["avatar"] })
                })
            } else {//需要更新图片
                const fs = require('fs');
                let D = Date.now();
                let saveImg = path.join(__dirname, '../static/upload/avatar/' + D + '.png');//api.js的上级的static下
                let pathImg = './static/upload/avatar/' + D + '.png';//返前台路径目录
                let base64 = req.body.avatar.replace(/^data:image\/\w+;base64,/, "");
                let dataBuffer = new Buffer(base64, 'base64'); //把base64码转成buffer对象，
                fs.writeFile(saveImg, dataBuffer, function (err) {//用fs写入文件
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('写入成功！', saveImg);
                        docs[0].nickName = req.body.nickName;
                        docs[0].avatar = pathImg;
                        db.User(docs[0]).save(function (err) {
                            if (err) {
                                res.status(500).send()
                                return
                            }
                            res.send({ 'status': 1, 'msg': '更新成功', 'user_name': docs[0]["name"], 'type': docs[0]["type"], 'nickName': docs[0]["nickName"], 'avatar': docs[0]["avatar"] })
                        })
                    }
                })
            }
        } else {
            res.send({ 'status': 0, 'msg': '更新失败' })
        }
    })
});

//评论--新建
router.post('/api/comment/new',(req, res) => {


  // 请求数据
  const userId = req.body.fromId;
  const articleId = req.body._id;
  const content = req.body.content;
  const date = req.body.date;
  const id = req.body.id;

  db.Article.find({ _id: articleId }, (err, docs) => {
        if (err) {
            return
        }
        let obj = { id, userId,content, date, child: [] };

        docs[0].comments.push(obj);
        db.Article(docs[0]).save(function (err) {
            if (err) {
                res.status(500).send()
                return
            }
            res.send({ 'status': 1, 'msg': '发表成功' })
        })
    })




});
//评论--回复
router.post('/api/comment/reply', (req, res) => {
    db.Article.find({ _id: req.body._id }, (err, docs) => {
        if (err) {
            return
        }
        // let { id, from_uid, from_uname, avatar, to_uid, to_uname, content, date } = req.body;
        // let obj = { from_uid, from_uname, avatar, to_uid, to_uname, content, date };
        let { id, from_uid,  to_uid, content, date } = req.body;
        let obj = { from_uid, to_uid, content, date };
        let comments = docs[0].comments;

        for (let i = 0; i < comments.length; i++) {
            if (comments[i]["id"] == id) {
                comments[i]["child"].push(obj)
            }
        }
        db.Article(docs[0]).save(function (err) {
            if (err) {
                res.status(500).send()
                return
            }
            res.send({ 'status': 1, 'msg': '回复成功' })
        })
    })
});


//获取所有文章列表
// req  请求的内容  res 返回的数据
router.post('/api/articleList', (req, res) => {
  let page = req.body.page;
  page = page==="undefined"?1:page; // 获取当前页码

  let pageSize = req.body.pagesize;   //  每页显示的文章数
  pageSize = pageSize==="undefined"?5:pageSize;   //  每页显示的文章数

  // 获取总数
  const t = db.Article.find({});
  let count;
  t.exec(function (err, data) {
    count = data.length;
  });


  // // 分页查询 (4)
  // 1 2 3 4 5 6 7 8 9 10
  const m = db.Article.find({});
  const start = (page - 1) * pageSize;    // 计算查询位置（分页）
  m.sort({"date":'desc'});  // 新增的时间，进行降序排序
  m.skip(start);            // 跳过去的数据总数
  m.limit(pageSize);                      // 查询大小

  // function(err, data){}
  //

  m.exec((err, data) => {
        if (err) {
            res.send(err);
            return
        }

        for (let i = 0; i < data.length; i++) {
            data[i]["comments"] = data[i]["comments"].length;   // 评论长度
            data[i]["content"] = null;
        }
        res.send({"data":data,"count":count});
  })

});


// archives结构文章
router.post('/api/archives',function(req,res){

  const m = db.Article.find({});
  m.exec((err, data)=>{

    if (err) {
        res.send(err);
        return
    }
    let arr = [];     // 年份数组
    let data_archives = [];

    for (let i = 0; i < data.length; i++) {
        let date = data[i]["date"].slice(0, 4);

        // // 查找分类id，获取名称
        // db.Category.find({'_id':data[i]['category']}, (err1, data1) => {
        //   if(data1[0]['category'] != 'undefined'){
        //     console.log(data1[0]['category']);
        //     // data[i]['category'] = data1[0]['category'];
        //   }
        // });
        //
        // // console.log("0"+data[i]['category']);

        if (arr.indexOf(date) == -1) {    // 当前 “年" 没有（2019）
            let obj = {                   // 重新组装数组
                "type": date,             // 2019
                "list": [{                // 下面的数组
                    "_id": data[i]['_id'],
                    "date": data[i]['date'],
                    "title": data[i]['title'],
                    "category": data[i]['category']
                }]
            };
            data_archives.push(obj);    // 存储的数据集列表
            arr.push(date);             // 2019已经有了
        }


        else {
            let obj = {
                "_id": data[i]['_id'],
                "date": data[i]['date'],
                "title": data[i]['title'],
                "category": data[i]['category']
            };
            for (let i = 0; i < data_archives.length; i++) {
                if (data_archives[i]['type'] == date) {
                    data_archives[i]['list'].push(obj)
                }
            }
        }
    }
    res.send(data_archives);
  });

});


// categories结构文章
router.post('/api/categories',function(req,res){

  const m = db.Article.find({});
  m.exec((err, data)=>{

    if (err) {
        res.send(err);
        return
    }
    let arr = [];
    let data_categories = [];

    for (let i = 0; i < data.length; i++) {
        let cates = data[i]["category"];

        for (let i2 = 0; i2 < cates.length; i2++) {
            if (arr.indexOf(cates[i2]) == -1) {
                let obj = {
                    "type": cates[i2],
                    "list": [{
                        "_id": data[i]['_id'],
                        "date": data[i]['date'],
                        "title": data[i]['title'],
                        "category": data[i]['category']
                    }]
                };
                data_categories.push(obj);
                arr.push(cates[i2]);
            } else {
                let obj = {
                    "_id": data[i]['_id'],
                    "date": data[i]['date'],
                    "title": data[i]['title'],
                    "category": data[i]['category']
                };
                for (let i3 = 0; i3 < data_categories.length; i3++) {
                    if (data_categories[i3]['type'] == cates[i2]) {
                        data_categories[i3]['list'].push(obj)
                    }
                }
            }
        }
    }
    res.send(data_categories);
  });

});

// 文章详情页
router.get('/api/articleDetail/:id', function (req, res) {
    db.Article.findOne({ _id: req.params.id },async function (err, docs) {
        if (err) {
            console.error(err)
            return
        }

        // 转换为json，才能进行编辑操作
        let obj = JSON.parse(JSON.stringify(docs));

        // 获取评论列表
        let comments = obj.comments;
        // console.log(comment);

        // 遍历列表利用async同步获取用户信息
        for(let i = 0; i < comments.length; i++){
          let userInfo = await findUserInfo(comments[i].userId);
          obj.comments[i].user_name = userInfo.nickName;
          obj.comments[i].avatar = userInfo.avatar;

          // 子评论
          for(let j = 0; j < comments[i].child.length; j++){

            let fromUser = await findUserInfo(comments[i].child[j].from_uid);
            comments[i].child[j].fromUserName = fromUser.nickName;
            comments[i].child[j].fromUserAvatar = fromUser.avatar;

            let toUser = await findUserInfo(comments[i].child[j].to_uid);
            comments[i].child[j].toUserName = toUser.nickName;
            comments[i].child[j].toUserAvatar = toUser.avatar;
          }

        }


        // 获取用户信息
        async function findUserInfo(userId){
           return new Promise(function (resolve, reject) {
             db.User.findOne({_id:userId}, (err, data) => {
               resolve(data);
             });
           })
        }

        let prev = {};
        let next = {};

        db.Article.find({ '_id': { "$gt": req.params.id } }) //上一条
            .then(res2 => {
                if (res2.length > 0) {
                    prev.title = res2[0]["title"];
                    prev._id = res2[0]["_id"];
                }
                db.Article.find({ '_id': { "$lt": req.params.id } }) //下一条
                    .then(res3 => {
                        if (res3.length > 0) {
                            next.title = res3[res3.length - 1]["title"];
                            next._id = res3[res3.length - 1]["_id"];
                        }
                        obj.prev = prev;
                        obj.next = next;
                        res.send(obj)
                    })
            })
            .catch(rej => {
                console.log(rej);
            });
    })
});


//获取所有demo列表
router.post('/api/demoList', (req, res) => {
    db.Demo.find({}, (err, data) => {
        if (err) {
            res.send(err);
            return
        }
        res.send(data)
    })
});

// demo详情页
router.get('/api/demoDetail/:id', function (req, res) {
    db.Demo.findOne({ _id: req.params.id }, function (err, docs) {
        if (err) {
            console.error(err)
            return
        }
        res.send(docs)
    })
});


// 获取网站信息
router.post('/api/webInfo', (req, res) => {
  db.Web.find({}, (err, data) => {
    if(err){
      res.send(err);
      return
    }
      res.send(data);
  });
});


// 关于我
router.post('/api/aboutMe', (req, res) => {
  db.Aboutme.find({}, (err, data) => {
    if(err){
      res.send(err);
      return
    }
    res.send(data);
  });
});


// 分类分页列表
router.post('/api/catetoryList',(req, res) => {
  let page = req.body.page;
  page = page==="undefined"?1:page; // 获取当前页码

  let pageSize = req.body.pagesize;   //  每页显示的文章数
  pageSize = pageSize==="undefined"?5:pageSize;   //  每页显示的文章数

  // 获取总数
  const t = db.Category.find({});
  let count;
  t.exec(function (err, data) {
    count = data.length;
  });


  const m = db.Category.find({});
  const start = (page - 1) * pageSize;    // 计算查询位置（分页）
  m.skip(start);            // 跳过去的数据总数
  m.limit(pageSize);                      // 查询大小


  m.exec((err, data) => {
        if (err) {
            res.send(err);
            return
        }
        res.send({"data":data,"count":count});
  })


});

// 获取所有分类
router.post('/api/categoryAll', (req, res) =>{

  const t = db.Category.find({});
  t.exec(function (err, data) {
    if (err) {
            res.send(err);
            return
        }
        res.send(data);
  });

});

module.exports = router;
