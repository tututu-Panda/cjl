<template>
  <el-form :model="infoForm" ref="infoForm" :rules="rules" label-width="100px" class="demo-ruleForm">

    <el-form-item label="名称" prop="name">
      <el-input v-model="infoForm.nickName" ></el-input>
    </el-form-item>

    <el-form-item label="更新密码" >
    <el-button type="text" @click="dialogPassVisible = true">修改密码</el-button>

    <el-dialog title="更新密码" :visible.sync="dialogPassVisible">

      <el-form :model="passForm" status-icon :rules="passRule" ref="passForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原密码" prop="oldPass" >
          <el-input type="password" v-model="passForm.oldPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="pass">
          <el-input type="password" v-model="passForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="passForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('passForm')">更新</el-button>
          <el-button @click="resetForm('passForm')">重置</el-button>
        </el-form-item>
      </el-form>

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

      // 请求后台接口检验原密码
      const validateOldPass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          // 检验密码是否正确
          let name = localStorage.getItem("nickName");
          let token = localStorage.getItem("token");
          this.$axios.post(webUrl+'/admin/checkPass',{'name':name,'token':token,'pass':value})
            .then(function (res) {
              if(res.data.status == 1){
                callback();
              }else{
                callback(new Error('密码错误！'));
              }
            });
        }
      };

      // 检验密码
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.passForm.checkPass !== '') {
            this.$refs.passForm.validateField('checkPass');
          }
          callback();
        }
      };

      // 检验重复密码
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.passForm.pass) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {

        infoForm:{
          nickName: '',
          avatar: '',
          token: '',
          name: '',
        },

        passForm:{
          pass:'',
          checkPass:'',
          oldPass:'',
        },

        rules: {
          name: [
            {required: true, message: '请输入名称', trigger: 'blur'},
          ],
        },
        passRule:{
          oldPass:[
             { validator: validateOldPass, trigger: 'blur' }
          ],
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          checkPass: [
            { validator: validatePass2, trigger: 'blur' }
          ],
        },

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


            // 更新用户信息
            if(formName == 'infoForm') {
              // 请求后台API更新数据
              this.$axios.post(webUrl + 'admin/updateUser', this.infoForm).then((res) => {
                if (res.data.status == 1) {
                  localStorage.setItem("nickName", res.data.nickName);
                  localStorage.setItem("avatar", res.data.avatar);
                  this.$store.state.avatar = res.data.avatar;
                  // console.log("store:"+this.$store.state.avatar);
                  this.$message({
                    type: 'success',
                    message: '更新成功！'
                  });
                } else {
                  this.$message({
                    type: 'error',
                    message: '更新失败！'
                  });
                }
              });
            }

            // 更新密码
            if(formName == 'passForm'){
              let that = this;
              let name = localStorage.getItem("nickName");
              let token = localStorage.getItem("token");
              this.$axios.post(webUrl + 'admin/updatePass', {'name':name,'token':token,'pass':this.passForm.pass})
                .then((res) => {
                  that.dialogPassVisible = false;
                  if(res.data.status == 1){
                    this.$message({
                    type: 'success',
                    message: '更新成功！'
                    });
                  }
                  else {
                  this.$message({
                    type: 'error',
                    message: '更新失败！'
                  });
                }
              });
            }
          } else {
            return false;
          }
        });
      },

      //重置表单
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },

      // 上传头像
      upLoad: function(e) {
        // console.log(e.target.files);
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
                that.infoForm.avatar = base64;

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
