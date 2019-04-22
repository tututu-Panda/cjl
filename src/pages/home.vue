<template>
  <div class="page">
      <div class="wrapper">
        <el-row>
            <!--文章列表显示-->
            <el-col :xs="24" :sm="4" :md="18" :lg="18" :xl="18">
              <div class="main">
                <div>
                  <div class="card" v-for="(item) in items" :key="item.id">
                    <router-link :to="'/detail/'+item._id">
                      <p class="card_title">{{item.title}}</p>
                      <p class="gist">{{item.gist}}</p>
                    </router-link>
                    <p class="date">{{item.date}}</p>
                  </div>
                    <el-pagination
                      background
                      :page-size="pagesize"
                      layout="prev, pager, next,total"
                      @current-change="queryArticle"
                      :current-page="currentPage"
                      :total="count">
                    </el-pagination>
                </div>
              </div>
            </el-col>


<!--          webinfo-->
            <el-col :xs="0" :sm="4" :md="6" :lg="6" :xl="6">
              <div class="aside">
                <div class="card">
                  <p class="title">ABOUT ME</p>

                  <img class="pic" :src="ruleForm.photo" alt="">
                  <div class="row">
                    <p>{{ruleForm.matto}}</p>
                    <div class="icons">
                      <a :href="ruleForm.github" target="_blank"><i class="iconfont icon-github"></i></a>
                      <a :href="ruleForm.zhihu" target="_blank"><i class="iconfont icon-zhihu"></i></a>
                      <a :href="ruleForm.music" target="_blank"><i class="iconfont icon-yinle"></i></a>
                      <a :href="ruleForm.weibo" target="_blank"><i class="iconfont icon-weibo"></i></a>
                    </div>
                  </div>
                </div>
                <div class="card">
                  <p class="title">FRIENDS</p>
                  <div class="row">
                    <a class="link" v-for="list in ruleForm.lists" :href="list.link" target="_blank">{{list.name}}</a>
                  </div>
                </div>
              </div>
            </el-col>
        </el-row>
      </div>
  </div>
</template>

<script>
import {webUrl} from "../../static/js/public.js"
export default {
  data(){
    return{
      items:[],       // 文章列表数据
      count:0,        // 文章的总数
      currentPage:1,  // 初始化时的页码
      pagesize:4,     // 每页显示的个数
      // 网站内容
      ruleForm: {
        _id:'',
        title: '',
        matto: '',
        photo:'/static/img/p1.png',
        github:'',
        zhihu:'',
        music:'',
        weibo:'',
        lists:[
        ],
      },
    }
  },
  created(){
    // 首次创建时，请求数据
    // webUrl == /api/
    this.$axios.post(webUrl+'articleList',{'pagesize':this.pagesize})
      .then((res)=>{
        this.items=res.data.data;
        this.count=res.data.count;
      });

    // webInfo
    this.$axios.post(webUrl+'webInfo')
      .then((res) => {
        if(res.data[0]!=null){
          this.ruleForm = res.data[0];
        }
        // console.log(this.ruleForm);
      });
  },
  methods:{
    // 根据页码查询数据
    queryArticle:function(page){
      this.$axios.post(webUrl+'articleList',{"page":page,'pagesize':this.pagesize})
      .then((res)=>{
        this.items=res.data.data;
        this.count=res.data.count;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main{
  background: #f8f8fd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 30px rgba(10, 10, 0, 0.1) inset;
  margin:0 10px;
  padding: 10px;
}
.aside{
  background: #f8f8fd;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.4), 0 0 30px rgba(10, 10, 0, 0.1) inset;
  .card{
    border-top: 1px solid #eee;
    .title{
      padding: 10px;
      font-weight: 600;
      color:#808080;
      margin-bottom: 10px;
    }
    .pic{
      width: 100%;
    }
    .row{
      padding: 0 10px;
      &>p{
        color:#bfbfbf;
        
      }
      .icons{
        padding:10px 0;
        .iconfont{
          transition: all .3s;
          margin: 5px;
          color: #000;
          font-size: 20px;
          background-color: rgba(200, 200, 200, 0.3);
          padding: 8px;
          border-radius: 50%;
          &:hover{            
            color:#fff;
            background-color: rgba(0, 133, 166, 0.8);
            border-radius: 5px;          
          }
        }
      }

      &>.link{
        color:#bfbfbf;
        display: inline-block;
        padding: 5px;
        transition: all .3s;        
        &:hover{
          color: #0085a1;
        }
      }
    }
  }
}

@media (min-width: 768px) {//pc
  .main{
    margin:0 20px;
    padding: 20px;
  }
}
</style>


<style lang="scss" scoped>
  .card{
    margin: 10px 0 0 0;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
    .card_title{
      font-size: 18px;
      font-weight: 600;
      color: #0085A1;
    }
    .gist{
      transition: all .3s;
      font-style: italic;
      color:#a3a3a3;
      margin: 5px 0;
      &:hover{
        color: #0085a1;
      }
    }
    .date{
      font-style: italic;
      font-family: Lora,'Times New Roman',serif;
      color: #808080;
    }
  }
@media (min-width: 768px) {//pc
  .card{
    padding-bottom: 20px;
    .card_title{
      font-size: 26px;
    }
    .gist{
      margin: 10px 0;
    }
  }
}
</style>
