<template>
  <div class="navbar">
    <el-button @click="toHome"  round>返回首页</el-button>
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <img  v-bind:src="avatar"  class="user-avatar" />
        <i class="el-icon-caret-bottom"></i>
      </div>
      <el-dropdown-menu slot="dropdown" class="user-dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            Home
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided>
          <span style="display:block;" @click="logout">LogOut</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>

import { webUrl } from "../../../../../static/js/public.js";
import imgDefault from "../../../../../static/img/avatar.png";

export default {

  data() {
    return {
      // avatar: "",
      name: "",
      token: "",

    }
  },
  computed: {
    avatar:function () {
      return this.$store.state.avatar =="null"?imgDefault:this.$store.state.avatar;
    },
  },
  created() {
    this.name = localStorage.getItem("user_name");
    this.token = localStorage.getItem("token");
  },
  methods: {
    toHome: function() {
      this.$router.replace({ name: "home" });
    },
    logout() {
      //退出
      let that = this;
      that.$axios
        .post(webUrl + "signOut", {
          name: that.name,
          token: that.token
        })
        .then(response => {
            // localStorage.clear();
          if (response.data.status == 1) {
            this.$message({
              showClose: true,
              message: '退出成功！',
              type: 'success'
            });
            this.$store.commit("changeIsSignIn", 0);
            this.$store.commit("changeIndex", "1");
            localStorage.clear();
            this.$router.replace({ name: "home" });
          }
        })
        .catch(reject => {
          console.log(reject);
        });
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  box-shadow: 0 1px 3px 0 rgba(0,0,0,.12), 0 0 3px 0 rgba(0,0,0,.04);
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      line-height: initial;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
  }
}
</style>

