export default [
  { path: '/404', component: () => import('@/pages/common/404'), hidden: true },    // 定义404页面
  { path: '*', redirect: '/404', hidden: true }   // 当其他路径没有匹配时，自动跳转到’/404‘路由
]
