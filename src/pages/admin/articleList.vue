<template>
  <div id="content">
    <h1 class="title">{{type=='article'?'文章列表':'demo列表'}}</h1>
    <div class="tab-box">
      <el-button-group>
        <el-button :type="type=='article'?'primary':'info'" @click="toggle"><i class="iconfont icon-archives"></i> 文章列表</el-button>
        <el-button :type="type=='demo'?'primary':'info'" @click="toggle"><i class="iconfont icon-play"></i> Demo</el-button>
      </el-button-group>
    </div>

    <div v-if="type=='article'">
      <el-button  @click="handleAdd()" class="btn-add">新增+</el-button>
      <el-table
        :data="articleList"
        style="width: 100%"
        header-align='right'
        border
        stripe>
        <el-table-column
            label="标题"
            width="250">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="日期"
            width="250">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.date }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="摘要"
            width="250">
            <template slot-scope="scope">
              <span>{{ scope.row.gist.slice(0,30) }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="分类"
            width="250">
            <template slot-scope="scope">
                <span v-if="scope.row.category.length === 0">未分类</span>
              <el-tag v-else class="tag_margin" type="primary" v-for="tag in scope.row.category" :key="tag.id">
                <span v-for="cate in categoryList" v-if="cate._id == tag">{{cate.category}}</span>
              </el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleLook(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <div>
          <el-pagination
            background
            :page-size="pagesize"
            layout="prev, pager, next,total"
            :current-page="currentPage"
            @current-change="queryArticle"
            :total="count">
          </el-pagination>
      </div>
    </div>

    <div v-if="type=='demo'">
        <el-button  @click="handleAdd2()" class="btn-add">新增+</el-button>
        <el-table
          :data="demoList"
          style="width: 100%"
          header-align='right'
          border
          stripe>
        <el-table-column
            label="标题"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="日期"
            width="200">
            <template slot-scope="scope">
              <i class="el-icon-time"></i>
              <span>{{ scope.row.date }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="file"
            width="200">
            <template slot-scope="scope">
                <span>{{ scope.row.file }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="图片"
            width="200">
            <template slot-scope="scope">
                <span>{{ scope.row.pic }}</span>
            </template>
        </el-table-column>
        <el-table-column
            label="摘要"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.gist.slice(0,30) }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handleLook2(scope.$index, scope.row)">查看</el-button>
              <el-button
                size="mini"
                type="success"
                @click="handleEdit2(scope.$index, scope.row)">编辑</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="handleDelete2(scope.$index, scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { checkAdmin } from "../../../static/js/public.js";
import { webUrl } from "../../../static/js/public.js";

export default {
  data() {
    return {
      articleList: [],
      demoList: [],
      categoryList:[],
      type: "article",
      count:0,
      currentPage:1,  // 初始化时的页码
      pagesize:5      // 每页显示的个数
    };
  },
  created() {
    this.nickName = localStorage.getItem("nickName");
    this.avatar = localStorage.getItem("avatar");
    this.name = localStorage.getItem("user_name");
    this.token = localStorage.getItem("token");
  },

  mounted: function() {
    // 获取文章列表
    this.$axios.post(webUrl + "articleList",{'pagesize':this.pagesize}).then(res => {
      if (res) {
        this.articleList = res.data.data;
        this.count = res.data.count;
      }
    });
    // 获取demo列表
    this.$axios.post(webUrl + "demoList").then(res => {
      if (res) {
        this.demoList = res.data.reverse();
      }
    });

    // 获取分类列表
    this.$axios.post('/api/categoryAll')
      .then((response) =>{
        this.categoryList = response.data;
    });

  },
  methods: {
    signOut: function(){
      //退出
      let that = this;
      that.$axios
        .post(webUrl + "signOut", {
          name: that.name,
          token: that.token
        })
        .then(response => {
          this.$message({
            message:response.data.msg
            ,type:'success'
          });
          if (response.data.status == 1) {
            this.$store.commit("changeIsSignIn", 0);
            this.$store.commit("changeIndex", "1");
            localStorage.clear();
            this.$router.replace({ name: "home" });
          }
        })
        .catch(reject => {
          console.log(reject);
        });
    },

    // 请求分页数据
    queryArticle:function(page){
      this.$axios.post(webUrl+'articleList',{"page":page,'pagesize':this.pagesize})
      .then((res)=>{
        this.articleList=res.data.data;
      })
    },
    toggle() {
      //切换
      this.type = this.type == "article" ? "demo" : "article";
    },
    handleAdd() {
      //新增
      this.$router.push("/admin/edit");
    },
    handleAdd2() {
      //新增-demo
      this.$router.push("/admin/editt");
    },
    handleLook(index, row) {
      //查看
      let id = row._id;
      window.open("#/detail/" + id);
    },
    handleLook2(index, row) {
      //查看-demo
      window.open("#/demo/");
    },
    handleEdit(index, row) {
      //编辑
      let id = row._id;
      this.$router.push("/admin/edit/" + id);
    },
    handleEdit2(index, row) {
      //编辑-demo
      let id = row._id;
      this.$router.push("/admin/editt/" + id);
    },
    handleDelete(index, row) {
      //删除
      let self = this;
      let _id = row._id;
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.$axios
            .post(webUrl + "admin/deleteArticle", { _id: _id })
            .then(res => {
              if (res.data.status == 1) {
                self.$message({
                  type: "success",
                  message: "删除成功!"
                });
                self.fetchData();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    handleDelete2(index, row) {
      //删除--demo
      let self = this;
      let _id = row._id;
      this.$confirm("此操作将永久删除该文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          self.$axios
            .post(webUrl + "admin/deleteDemo", { _id: _id })
            .then(res => {
              if (res.data.status == 1) {
                self.$message({
                  type: "success",
                  message: "删除成功!"
                });
                self.fetchData2();
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    fetchData: function() {
      // 更新数据
      this.$axios.post(webUrl + "articleList").then(res => {
        if (res) {
          this.articleList = res.data;
        }
      });
    },
    fetchData2: function() {
      // 更新数据---demo
      this.$axios.post(webUrl + "demoList").then(res => {
        if (res) {
          this.demoList = res.data;
        }
      });
    }
  }
};
</script>


<style>
.el-table .cell {
  text-align: center;
}
</style>
<style lang="scss" scoped>
#content {
  width: 1300px;
  margin: 0 auto;
  > .title {
    margin: 30px 0;
    text-align: center;
  }
  .tab-box {
    text-align: center;
    margin-bottom: 20px;
  }
  .btn-add {
    float: right;
    margin-bottom: 20px;
  }
}
</style>
