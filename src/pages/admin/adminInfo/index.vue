<template>
  <el-form  ref="ruleForm" label-width="100px" class="demo-ruleForm">

    <el-form-item label="网站名称" prop="title">
      <el-input ></el-input>
    </el-form-item>

    <el-form-item label="座右铭" prop="matto">
      <el-input ></el-input>
    </el-form-item>

    <el-form-item label="github链接" prop="github">
      <el-input ></el-input>
    </el-form-item>
    <el-form-item label="知乎链接" prop="zhihu">
      <el-input ></el-input>
    </el-form-item>

    <el-form-item label="网易云链接" prop="music">
      <el-input></el-input>
    </el-form-item>

    <el-form-item label="微博链接" prop="weibo">
      <el-input ></el-input>
    </el-form-item>


    <el-form-item label="背景墙">
      <el-upload
        class="upload-demo"
        drag
        action="https://jsonplaceholder.typicode.com/posts/"
        :limit="1"
        >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
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

      };
    },


    created(){

    },


    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log();
            // 请求后台API更新数据
            this.$axios.post(webUrl+'admin/saveWebInfo').then((res)=>{
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
