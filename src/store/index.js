import Vue from 'vue'
import Vuex from 'vuex'
import { mapState } from 'vuex'
import app from "./app"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    activeIndex: '1',//导航选中
    isSignIn: 0,//0未登录，1admin，2游客\
    avatar:'',  // 后台显示的头像，更新的话，所有组件同时更新
  },
  modules:{
    app,
  },
  mutations: {
    changeIndex(state, n) {
      state.activeIndex = n
    },
    changeIsSignIn(state, n) {
      state.isSignIn = n
    }
  }
})
