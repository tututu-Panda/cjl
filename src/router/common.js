export default [
  { path: '/404', component: () => import('@/pages/common/404'), hidden: true },
  { path: '*', redirect: '/404', hidden: true }
]
