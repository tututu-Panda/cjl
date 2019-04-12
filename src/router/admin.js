// 文章列表
const ArticleList = r => require.ensure([], () => r(require('@/pages/admin/articleList')), 'chunkname3')
// 文章编辑
const ArticleEdit = r => require.ensure([], () => r(require('@/pages/admin/articleEdit')), 'chunkname3')
// demo编辑
const DemoEdit = r => require.ensure([], () => r(require('@/pages/admin/demoEdit')), 'chunkname3')
// 后台框架
// const Layout = r => require.ensure([], () => r(require('@/pages/admin/layout/Layout')), 'chunkname3')
// 后台主页
// const dashboard = r => require.ensure([], () => r(require('@/pages/admin/dashboard/index')), 'chunkname3')
// //用户主页
// const VisiterIndex = r => require.ensure([], () => r(require('@/pages/admin/user')), 'chunkname3')


export  default [
  {
    path:'/admin/list',
    name: 'ArticleList',
    component: ArticleList
  },
  {
    path: '/admin/edit',
    name: 'ArticleEdit',
    component: ArticleEdit
  },
  {
    path: '/admin/edit/:id',
    name: 'ArticleUpdate',
    component: ArticleEdit
  },
  {
    path: '/admin/editt',
    name: 'DemoEdit',
    component: DemoEdit
  },
  {
    path: '/admin/editt/:id',
    name: 'DemoUpdate',
    component: DemoEdit
  },



]

