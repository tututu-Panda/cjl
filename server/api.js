"use strict";
const db = require('./db');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");


// 用户信息更新
//检测token
router.post('/api/admin/checkUser', (req, res) => {
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

//文章保存
router.post('/api/admin/saveArticle', (req, res) => {
    let newArticle = new db.Article(req.body.articleInformation);
    newArticle.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send({ 'status': 1, 'msg': '保存成功' });
        }
    })
});

// 文章更新
router.post('/api/admin/updateArticle',(req, res) => {

    let info = req.body.articleInformation
    db.Article.find({ _id: info._id }, (err, docs) => {
        if (err) {
            return
        }
        docs[0].title = info.title
        docs[0].date = info.date
        docs[0].category = info.category
        docs[0].gist = info.gist
        docs[0].content = info.content
        docs[0].html = info.html
        db.Article(docs[0]).save(function (err) {
            if (err) {
                res.status(500).send()
                return
            }
            res.send({ 'status': 1, 'msg': '更新成功' })
        })
    })
});


// 文章删除
router.post('/api/admin/deleteArticle', (req, res) => {
    db.Article.remove({ _id: req.body._id }, (err) => {
        if (err) {
            res.status(500).send()
            return
        }
        res.send({ 'status': 1, 'msg': '删除成功' })
    })
});


//demo保存
router.post('/api/admin/saveDemo', (req, res) => {
    let newDemo = new db.Demo(req.body.demoInformation);
    newDemo.save(function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send({ 'status': 1, 'msg': '保存成功' });
        }
    })
});

// demo更新
router.post('/api/admin/updateDemo', (req, res) => {
    let info = req.body.demoInformation;
    db.Demo.find({ _id: info._id }, (err, docs) => {
        if (err) {
            return
        }
        docs[0].title = info.title
        docs[0].date = info.date
        docs[0].file = info.file
        docs[0].pic = info.pic
        docs[0].gist = info.gist
        db.Demo(docs[0]).save(function (err) {
            if (err) {
                res.status(500).send()
                return
            }
            res.send({ 'status': 1, 'msg': '更新成功' })
        })
    })
})
// demo删除
router.post('/api/admin/deleteDemo', (req, res) => {
    db.Demo.remove({ _id: req.body._id }, (err) => {
        if (err) {
            res.status(500).send()
            return
        }
        res.send({ 'status': 1, 'msg': '删除成功' })
    })
})

module.exports = router;
