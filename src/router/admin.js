
import Layout from '../pages/admin/layout/Layout'



export  default [
  {
    path:'/admin',
    component:Layout,
    hidden:true,
    children:[
      {
        path:'dashboard',
        name:'控制面板',
        component:() => import('@/pages/admin/dashboard/index')
      },
      {
        path:'list',
        name:'文章列表',
        component:() => import('@/pages/admin/articleList')
      },
      {
        path: '/admin/edit',
        name: '文章修改',
        component:() => import('@/pages/admin/articleEdit')
      },
      {
        path: '/admin/edit/:id',
        name: '文章更新',
        component:() => import('@/pages/admin/articleEdit')
      },
      {
        path: '/admin/editt',
        name: 'demo更新',
         component:() => import('@/pages/admin/demoEdit')
      },
        {
        path: '/admin/editt/:id',
        name: 'demo更新',
         component:() => import('@/pages/admin/demoEdit')
      },
    ]

  },


]

