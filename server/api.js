"use strict";
const db = require('./db');
const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");


// 检查用户是否为管理员，不是则不能请求数据
router.post("/api/admin/*",(req,res,next)=>{
  // console.log(req.session.type);
  if(req.session.type != 1){
    res.send({ 'status': 0, 'info': "不是管理员"});
  }else{
    next();
  }
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
});
// demo删除
router.post('/api/admin/deleteDemo', (req, res) => {
    db.Demo.remove({ _id: req.body._id }, (err) => {
        if (err) {
            res.status(500).send()
            return
        }
        res.send({ 'status': 1, 'msg': '删除成功' })
    })
});

module.exports = router;
