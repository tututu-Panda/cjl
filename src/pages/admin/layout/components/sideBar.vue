<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      :collapse-transition="false"
      mode="vertical"
    >
       <el-menu-item index="1">
        <i class="el-icon-menu"></i>
         <span slot="title"><router-link class="menu-style" :to="{ path: '/admin/dashboard' }">网站管理</router-link></span>
      </el-menu-item>
      <el-menu-item index="2">
        <i class="el-icon-document"></i>
        <span slot="title"><router-link class="menu-style" :to="{ path: '/admin/adminInfo' }">管理员信息</router-link></span>
      </el-menu-item>
      <el-menu-item index="3">
        <i class="el-icon-setting"></i>
        <span slot="title" ><router-link class="menu-style" :to="{ path: '/admin/aboutMe' }">关于我</router-link></span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title"><router-link class="menu-style" :to="{ path: '/admin/label' }">标签管理</router-link></span>
      </el-menu-item>
      <el-menu-item index="5">
        <i class="el-icon-setting"></i>
        <span slot="title"><router-link class="menu-style" :to="{ path: '/admin/list' }">文章管理</router-link></span>
      </el-menu-item>
      <el-menu-item index="6">
        <i class="el-icon-setting"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import variables from '@/styles/variables.scss'

export default {
  computed: {

    variables() {
      return variables
    },
  }
}
</script>
