"use strict";
const db = require('./db');
const express = require('express');
const router = express.Router();
const path = require('path');

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

// 更新网站信息
router.post('/api/admin/saveWebInfo',(req, res)=>{
    let info = req.body.webInfo;

    // console.log(info);

    // 插入操作
    if(info._id=="") {
        console.log("插入");
        let webInfo = new db.Web({
          title: info.title,
          matto: info.matto,
          photo: info.photo,
          github: info.github,
          zhihu: info.zhihu,
          music: info.music,
          weibo: info.weibo,
          lists: info.lists,
        });
        db.Web(webInfo).save(function (err) {
          if (err) {
            res.status(500).send();
            return
          }
          res.send({'status': 1, 'msg': '更新成功'})
        })
    }

    // 更新操作
    else{
      db.Web.find({ _id: info._id }, (err, docs) => {
        if (err) {
          // console.log(err);
            return
        }
        console.log("length:"+info.photo);
        docs[0].title = info.title;
        docs[0].matto = info.matto;
        docs[0].photo = info.photo;
        docs[0].github = info.github;
        docs[0].zhihu = info.zhihu;
        docs[0].music = info.music;
        docs[0].weibo = info.weibo;
        docs[0].lists = info.lists;
        if(docs.length > 0){
          db.Web(docs[0]).save(function (err) {
              if (err) {
                  res.status(500).send();
                  return
              }
              res.send({ 'status': 1, 'msg': '更新成功' })
          })
        }
        else{
          res.status(500).send();
        }
      });

    }

});

// 更新关于我
router.post('/api/admin/saveAboutMe',(req, res)=> {
  let _id = req.body._id;
  let content = req.body.content;

console.log(_id);
  // 插入操作
  if(_id==="" || _id === undefined) {
    console.log("插入");
    let aboutme = new db.Aboutme({
          content: content,
    });
    db.Aboutme(aboutme).save(function (err) {
      if (err) {
        res.status(500).send();
        return
      }
      res.send({'status': 1, 'msg': '更新成功'})
    })

  }
  // 更新操作
  else{
    db.Aboutme.find({ _id: _id }, (err, docs) => {
          if (err) {
              return
          }
          if(docs.length > 0){

            docs[0].content = content;
            db.Aboutme(docs[0]).save(function (err) {
                if (err) {
                    res.status(500).send();
                    return
                }
                res.send({ 'status': 1, 'msg': '更新成功' })
            })
          }else{
            res.status(500).send();
          }
      })
  }


});

// 更新管理员信息
router.post('/api/admin/updateUser', (req, res) => {
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
                                res.status(500).send();
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


// 检验用户密码是否正确
router.post('/api/admin/checkPass', (req, res) => {
  db.User.find({ name: req.body.name, token: req.body.token, password:req.body.pass }, (err, docs) => {
    if(docs.length > 0){
      res.send({'status':1});
    }else{
      res.send({'status':0});
    }
  });

});


// 更新用户密码
router.post('/api/admin/updatePass', (req, res) => {
  db.User.find({name: req.body.name, token: req.body.token}, (err, docs) => {
    docs[0].password = req.body.pass;
    db.User(docs[0]).save(function (err) {
      if (err) {
        res.status(500).send();
        return
      }
      res.send({'status': 1, 'msg': '更新成功'});
    })
  });
});



// 文章分类管理
router.post('/api/admin/updateCategory', (req, res) => {
  const _id = req.body._id;
  const categoryName = req.body.category;

  // 插入操作
  if(_id==="" || _id === undefined) {
    db.Category.find({ category: categoryName }, (err, docs) => {

      if (err) {
            return
      }

      // 已经存在分类
      if(docs.length > 0){
         res.send({'status': 0, 'msg': '添加失败，已经存在该分类！'})
      }
      // 进行添加
      else{
        let category = new db.Category({
              category: categoryName,
        });
        db.Category(category).save(function (err) {
          if (err) {
            res.send({'status': 0, 'msg': '系统错误'});
            return
          }
          res.send({'status': 1, 'msg': '添加成功'})
        })
      }

    });

  }
  // 更新操作
  else{
    db.Category.find({ _id: _id }, (err, docs) => {
        if (err) {
            return
        }
        if(docs.length > 0){

          db.Category.find({ category: categoryName }, (err, docs) => {
             // 已经存在分类
              if(docs.length > 0){
                 res.send({'status': 0, 'msg': '更新失败，已经存在该分类！'})
              }
              else{
                // 进行更新操作
                docs[0].category = categoryName;
                db.Category(docs[0]).save(function (err) {
                    if (err) {
                        res.status(500).send();
                        return
                    }
                    res.send({ 'status': 1, 'msg': '更新成功' })
                })

              }
          });

        }else{
          res.send({'status': 0, 'msg': '更新失败'});
        }
    })
  }
});


// 删除文章分类
router.post('/api/admin/deleteCategory', (req, res) => {
  const _id = req.body._id;

  db.Category.remove({ _id: _id },(err) => {
      if (err) {
          res.send({'status': 0, 'msg': '更新失败'});
          return
      }
      res.send({ 'status': 1, 'msg': '删除成功' })
  })


});

module.exports = router;
