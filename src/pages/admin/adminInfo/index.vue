<template>
  <el-form :model="infoForm" ref="infoForm" :rules="rules" label-width="100px" class="demo-ruleForm">

    <el-form-item label="名称" prop="name">
      <el-input v-model="infoForm.nickName" ></el-input>
    </el-form-item>

    <el-form-item label="更新密码" >
    <el-button type="text" @click="dialogPassVisible = true">修改密码</el-button>
    <el-dialog title="更新密码" :visible.sync="dialogPassVisible">
        <el-input v-model="pass" ></el-input>
    </el-dialog>
    </el-form-item>


    <el-form-item label="上传图片" style="width: 20%" >
      <label for="upLoad">
        <img :src="infoForm.avatar!='null'?infoForm.avatar:imgDefault" alt="" class="avatar">
      </label>
      <input @change="upLoad" id="upLoad" type="file">
    </el-form-item>



    <el-form-item>
      <el-button type="primary" @click="submitForm('infoForm')">立即更新</el-button>
      <el-button @click="resetForm('infoForm')">重置</el-button>
    </el-form-item>
  </el-form>

</template>
<script>
  import {imgTo64, webUrl} from "../../../../static/js/public.js"
  export default {
    data() {
      return {

        infoForm:{
          nickName: '',
          avatar: '',
          token: '',
          name: '',
        },

        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
        },

        pass:null,
        dialogPassVisible:false,
      };
    },


    created(){
      this.infoForm.nickName = localStorage.getItem("nickName");
      this.infoForm.avatar = localStorage.getItem("avatar");
      this.infoForm.name = localStorage.getItem("user_name");
      this.infoForm.token = localStorage.getItem("token");
    },


    methods: {
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            console.log();
            // 请求后台API更新数据
            this.$axios.post(webUrl+'admin/updateUser',this.infoForm).then((res)=>{
              if(res.data.status == 1){
                localStorage.setItem("user_name", res.data.user_name);
                localStorage.setItem("nickName", res.data.nickName);
                localStorage.setItem("avatar", res.data.avatar);
                localStorage.setItem("type", res.data.type);
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
            return false;
          }
        });
      },

      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      upLoad: function(e) {
        //上传头像
        let that = this;
        let files = e.target.files || e.dataTransfer.files;

        if (!files.length) return;
        if (
          files[0].type.indexOf("png") > -1 ||
          files[0].type.indexOf("jpg") > -1 ||
          files[0].type.indexOf("jpeg") > -1
        ) {
          if (files[0].size < 2000000) {
            if (typeof FileReader === "undefined") {
              this.$message({
                message: '您的浏览器不支持图片上传，请升级您的浏览器',
                type: 'warning'
              });
            }
            let reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = function(e) {
              let image = new Image();
              image.src = e.target.result; //原始base64
              image.setAttribute("crossOrigin", "anonymous"); //允许图片跨域请求、必须后台也允许
              image.onload = () => {
                let base64 = imgTo64(image); //使用cavas压缩
                that.avatar = base64;
              };
            };
          } else {
            this.$message({
              message: '请上传2M以内的图片',
              type: 'warning'
            });
          }
        } else {
          this.$message({
              message: '请上传JPG/PNG格式的图片',
              type: 'warning'
          });
        }
      },



    }
  }
</script>
<style>

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
