<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="网站名称" prop="title">
      <el-input v-model="ruleForm.title"></el-input>
    </el-form-item>

    <el-form-item label="座右铭" prop="matto">
      <el-input v-model="ruleForm.matto"></el-input>
    </el-form-item>

    <el-form-item label="github链接" prop="github">
      <el-input v-model="ruleForm.github"></el-input>
    </el-form-item>
    <el-form-item label="知乎链接" prop="zhihu">
      <el-input v-model="ruleForm.zhihu"></el-input>
    </el-form-item>

    <el-form-item label="网易云链接" prop="music">
      <el-input v-model="ruleForm.music"></el-input>
    </el-form-item>

    <el-form-item label="微博链接" prop="weibo">
      <el-input v-model="ruleForm.weibo"></el-input>
    </el-form-item>


    <el-form-item label="背景墙">
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :limit="1"
        >
        <img v-if="ruleForm.photo" :src="ruleForm.photo" class="avatar">
        <i v-else class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-form-item>


    <el-form-item label="友情链接" >
    <el-row :gutter="4" >
      <el-col :span="4"  v-for="(list,index) in ruleForm.lists" :key="list.index">
        <div class="grid-content bg-purple" >
          <el-card  :body-style="{ padding: '0px' }">
              <div style="padding: 14px;">
                <span>{{list.name}}:</span>
                <a :href="list.link">{{list.link}}</a>
                <i class="el-icon-delete" @click="deleteLink(index)" style="padding-left: 30px"></i>
                <div class="bottom clearfix">
                  <el-button type="text" @click="editLink(list.name,list.link)" class="button">编辑地址</el-button>
                </div>
              </div>
            </el-card>
        </div>
      </el-col>
    </el-row>

      <el-dialog title="新增友情链接" :visible.sync="dialogFormVisible">
        <el-form :model="form">
          <el-form-item label="名称" >
            <el-input  v-model="form.name"  autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="链接地址" >
            <el-input  v-model="form.link" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addLink()">确 定</el-button>
        </div>
      </el-dialog>


    <el-button  @click="dialogFormVisible=true" class="btn-add">新增+</el-button>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('ruleForm')">立即更新</el-button>
      <el-button @click="resetForm('ruleForm')">重置</el-button>
    </el-form-item>
  </el-form>

</template>
<script>
  import {webUrl} from "../../../../static/js/public.js"
  export default {
    data() {
      return {
        // 网站内容
        ruleForm: {
          _id:'',
          title: '',
          matto: '',
          photo:'/static/img/p1.2552007.png',
          github:'',
          zhihu:'',
          music:'',
          weibo:'',
          lists:[
            // {name:"wang1", link:"qwe"},
            // {name:"wang2", link:"qwe"},
            // {name:"wang3", link:"qwe"},
          ],
        },

        // 新增链接
        form: {
          name: '',
          link: '',
        },
        dialogFormVisible:false,

        // 检验输入框规则
        rules: {
          title: [
            { required: true, message: '请输入网站名称', trigger: 'blur' },
            { min: 3, max: 12, message: '长度在 3 到 12 个字符', trigger: 'blur' }
          ],
          matto: [
            { required: true, message: '请输入座右铭', trigger: 'blur' },
          ],
          github:[
             { required: true, message: '请输入gihub链接', trigger: 'blur' },
          ],
          zhihu:[
             { required: true, message: '请输入知乎链接', trigger: 'blur' },
          ],
          music:[
             { required: true, message: '请输入网易云链接', trigger: 'blur' },
          ],
          weibo:[
             { required: true, message: '请输入微博链接', trigger: 'blur' },
          ],
        }
      };
    },
    created(){
       this.$axios.post(webUrl+'webInfo')
      .then((res)=>{
        // console.log(res.data[0]);
        this.ruleForm = res.data[0];
      })
    },
    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log(this.ruleForm);
            // 请求后台API更新数据
            this.$axios.post(webUrl+'admin/saveWebInfo',{"webInfo":this.ruleForm}).then((res)=>{
              if(res.data.status == 1){
                this.$message({
                  type:'success',
                  message:'更新成功！'
                });
              }else{
                this.$message({
                  type:'error',
                  message:'更新失败！'
                });
              }
            });
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },

      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },


      // 编辑地址
      editLink:function(name,addr){
        // console.log(add);
        this.$prompt('请输入地址', '提示', {
          inputValue:addr,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.$message({
            type: 'success',
            message: name+'修改后的邮箱是: ' + value
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },

      // 添加地址
      addLink:function(){
        // console.log(this.form.name);
        // console.log(this.form.link);

        // 将新增加的链接添加到卡片上
        this.ruleForm.lists.push({"name":this.form.name,"link":this.form.link});
        // 重置form内容
        this.form.name='';
        this.form.link='';
        this.$message({
          type:'success',
          message:'添加成功，不要忘记提交表单哦！'
        });
        this.dialogFormVisible=false;
      },

      // 删除地址
      deleteLink:function(index){
        let that = this;
        // console.log(index);
        this.$confirm("确认删除吗？")
          .then(function () {
            that.ruleForm.lists.splice(index);    // 删除父类，需要提前定义
        });
      }
    }
  }
</script>
<style>

  .bg-purple {
    background: #d3dce6;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

</style>
