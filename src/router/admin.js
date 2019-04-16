
import Layout from '../pages/admin/layout/Layout'



export  default [
  {
    path:'/admin',
    component:Layout,
    hidden:true,
    meta:
    {
      requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
    },
    children:[

      {
        path:'dashboard',
        name:'控制面板',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/dashboard/index'),
      },
      {
        path:'adminInfo',
        name:'管理员信息',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/adminInfo/index'),
      },
      {
        path:'aboutMe',
        name:'关于我',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/aboutMe/index'),
      },
      {
        path:'list',
        name:'文章列表',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/articleList'),
      },
      {
        path: '/admin/edit',
        name: '文章修改',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/articleEdit')
      },
      {
        path: '/admin/edit/:id',
        name: '文章更新',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/articleEdit')
      },
      {
        path: '/admin/editt',
        name: 'demo更新',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
         component:() => import('@/pages/admin/demoEdit')
      },
        {
        path: '/admin/editt/:id',
        name: 'demo更新',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
         component:() => import('@/pages/admin/demoEdit')
      },
    ]

  },


]

