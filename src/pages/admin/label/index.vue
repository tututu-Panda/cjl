<template>
   <div id="content">
    <h1 class="title">标签管理</h1>
      <el-button type="" style="margin-bottom: 10px;" icon="el-icon-circle-plus" @click="addCategory">新增</el-button>
      <el-button type="danger" style="margin-bottom: 10px;" icon="el-icon-delete" @click="deleteMutil">删除选中</el-button>
    <el-table
        :data="categoryList"
        style="width: 100%"
        header-align='right'
        border
     @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
          sortable
          label="标签名称"
          prop="category"
          width="250">
      </el-table-column>

      <el-table-column label="操作" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="success"
              @click="handleEdit(scope.$index, scope.row)"
              >编辑</el-button>
            <el-button
              size="mini"
              icon="el-icon-delete"
              type="danger"
              @click="handleDelete(scope.$index,scope.row, categoryList)"
              >删除</el-button>
          </template>
      </el-table-column>
      </el-table>

     <div>
     <el-pagination
        background
        :page-size="pagesize"
        layout="prev, pager, next,total"
        :current-page="currentPage"
        @current-change="queryCategory"
        :total="count">
      </el-pagination>
     </div>

   </div>
</template>

<script>
    export default {
        data() {
          return {
            categoryList: [],
            multipleSelection: [],    // 多选id
            count:0,
            currentPage:1,  // 初始化时的页码
            pagesize:5      // 每页显示的个数
          };
        },

      mounted:function(){
        // 获取文章列表
        this.$axios.post("/api/catetoryList",{'pagesize':this.pagesize}).then(res => {
          if (res) {
            this.categoryList = res.data.data;
            this.count = res.data.count;
          }
        });

      },


      methods: {

        queryCategory(page){
          this.$axios.post('/api/catetoryList',{"page":page,'pagesize':this.pagesize})
            .then((res)=>{
              this.categoryList=res.data.data;
              this.currentPage = page;
            })
        },

        addCategory(){
         // 新增
          let that = this;
          this.$prompt('请输入标签名称','提示',{
            roundButton:true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\S+/,
            inputErrorMessage: '输入数据不能为空',
          })
           .then(({value})=>{
            this.$axios.post('/api/admin/updateCategory',{'category':value})
              .then(res => {
                if(res.data.status == 1){
                  // 当添加一个时，需要进行列表重获取
                  this.$axios.post("/api/catetoryList",{"page":that.currentPage,'pagesize':this.pagesize}).then(res => {
                    if (res) {
                      that.categoryList = res.data.data;
                      that.count = res.data.count;
                    }
                  });
                  this.$message({
                    message:res.data.msg
                    ,type:'success'
                  });
                }else{
                   this.$message({
                    message:res.data.msg
                    ,type:'error'
                  });
                }
              });
          });

        },
        handleEdit(index, row) {
          //编辑
          let id = row._id;
          let name = row.category;
          this.$prompt('请输入标签名称','提示',{
            roundButton:true,
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue:name,
            inputPattern: /\S+/,
            inputErrorMessage: '输入数据不能为空',
          })
            .then(({value})=>{
            this.$axios.post('/api/admin/updateCategory',{'_id':id,'category':value})
              .then(res => {
                if(res.data.status == 1){
                  row.category = value;   // 当编辑一个时，直接进行修改
                  this.$message({
                    message:res.data.msg
                    ,type:'success'
                  });
                }else{
                   this.$message({
                    message:res.data.msg
                    ,type:'error'
                  });
                }
              });
          });
        },

        handleDelete(index, row, rows){
          // 删除
          let id = row._id;
          let name = row.category;
          let that = this;
          this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            roundButton:true,
            type: 'warning'
          }).then(() => {
            this.$axios.post('/api/admin/deleteCategory',{'_id':id,'category':name})
              .then( res => {
                if(res.data.status == 1){
                  this.$axios.post("/api/catetoryList",{"page":that.currentPage,'pagesize':this.pagesize}).then(res => {
                    if (res) {
                      that.categoryList = res.data.data;
                      that.count = res.data.count;
                    }
                  });
                  this.$message({
                    message:res.data.msg
                    ,type:'success'
                  });
                }else{
                   this.$message({
                    message:res.data.msg
                    ,type:'error'
                  });
                }
              });

          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            });
          });
        },

        handleSelectionChange(val) {
        // 进行多选删除列表的创建
          this.multipleSelection = val;
            // console.log(val)
        },

        deleteMutil() {
          // 删除多选
          let that = this;
          let ids = [];
          // 遍历组装_id集合
          this.multipleSelection.forEach(row => {
            ids.push(row._id);
          });
          if (ids.length == 0) {
            this.$message({
              message: '请选择标签'
              , type: 'error'
            });
          } else {
            this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              roundButton: true,
              type: 'warning'
            }).then(() => {
              this.$axios.post('/api/admin/deleteCategory', {'_id': ids})
                .then(res => {
                  if (res.data.status == 1) {
                    // 当删除多个时时，需要进行列表重获取
                    this.$axios.post("/api/catetoryList", {"page":that.currentPage,'pagesize':this.pagesize}).then(res => {
                      if (res) {
                        that.categoryList = res.data.data;
                        that.count = res.data.count;
                      }
                    });
                    this.$message({
                      message: res.data.msg
                      , type: 'success'
                    });
                  } else {
                    this.$message({
                      message: res.data.msg
                      , type: 'error'
                    });
                  }
                });

            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          }
        }

       },
    }
</script>



<style lang="scss" scoped>
#content {
  width: 900px;
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
