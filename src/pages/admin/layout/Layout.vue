<template>
  <div class="app-wrapper">
<!--    <div v-if="device==='mobile'" class="drawer-bg" @click="handleClickOutside"/>-->
    <sideBar class="sidebar-container"/>
    <div class="main-container">
      <navBar/>
        <div class="main">
          <router-view></router-view>
        </div>
    </div>
  </div>
</template>

<script>
import sideBar from "./components/sideBar"
import navBar from "./components/navBar"
import appMain from "./components/appMain"
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    navBar,
    sideBar,
    appMain
  },
  mixins: [ResizeMixin],
  computed: {
    device() {
      return this.$store.state.app.device
    },
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }

  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
  .main{
    padding:20px;
  }
</style>
