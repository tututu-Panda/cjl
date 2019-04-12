<template>
  <div class="dashboard-container">
    <div class="dashboard-text">name:111</div>
    <div class="dashboard-text">roles:<span>222</span></div>
  </div>
</template>

<script>

export default {
  name: 'Dashboard',
  computed: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
