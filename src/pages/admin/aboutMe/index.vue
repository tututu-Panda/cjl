<template>
    <div class="edit_wrap">
      <div class="return_button">
        <el-button icon="arrow-left" @click="goBack">返回</el-button>
      </div>
      <div class="edit_head">内容 (Markdown编辑器)</div>
      <div class="markdown">
        <mavon-editor v-model="content" />
      </div>
      <div class="save_button">
        <el-button type="primary" @click="saveAboutMe">保存</el-button>
      </div>
    </div>
</template>

<script>
  export default {
    data() {
      return{
        _id:'',
        content:''
      }
    },
    created(){
      this.$axios.post('/api/aboutMe')
      .then((res)=>{
        // console.log(res.data[0]);
        const obj =res.data[0];
        if(obj != null){
          this._id = obj._id;
          console.log(this._id);
          this.content = obj.content;
        }
      })
    },
    methods: {
      goBack: function () {
        this.$router.go(-1)
      },
      saveAboutMe:function () {
         this.$axios.post('/api/admin/saveAboutMe',{"_id":this._id,"content":this.content})
      .then((res)=>{
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
      })
      }
    }
  }


</script>

<style scoped>

</style>
