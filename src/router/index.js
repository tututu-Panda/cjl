import Vue from 'vue'
import VueRouter from 'vue-router'


import common from './common'
import admin from './admin'
import visiter from './visiter'

Vue.use(VueRouter);

export default new VueRouter({
  routes:[
    ...common,     // 公共组件
    ...admin,     // 后台路由
    ...visiter,   // 前台路由
  ]
});


