import Vue from 'vue'
// import VueResource from 'vue-resource'
import axios from 'axios'
import router from './router/index'
import store from './store/index'
import '../static/js/animation.js'
import '../static/js/tween.js'
// import '../static/live2d/live2d_something.js'
// import '../static/live2d/live2d.js'
import '@/styles/index.scss'
import '../static/css/normalize.css'
import '../static/css/public.css'
import '../static/css/font/iconfont.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'element-ui/lib/theme-chalk/display.css';
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'


// Vue.use(VueResource)
Vue.prototype.$axios = axios
Vue.use(ElementUI)
Vue.use(mavonEditor)



/**
 * 路由管理
 * 从store里面获取isSignIn数值（1为管理员，2为游客）
 * 如果当前不是管理员那么不能访问后台页面
 */
router.beforeEach((to, from, next) => {
    if (to.meta.requireAuth) {  // 判断该路由是否需要登录权限
      //console.log(store.state.isSignIn);
        if (store.state.isSignIn == 1) {  // 通过vuex state获取isSignIn,判断是不是管理员
            next();
        }
        else {
            next('/')
        }
    }
    else {
        next();
    }
})

new Vue({
  el: '#app',
  data () {
    return {
    }
  },
  router,   //  路由控制
//   axios,
  store,    // 所有组件共享的资源
  // watch:{
  //   '$route'(to,from){
  //      console.log(to)
  //    }
  // }
})



