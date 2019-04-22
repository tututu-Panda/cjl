
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
        name:'dashboard',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/dashboard/index'),
      },
      {
        path:'adminInfo',
        name:'adminInfo',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/adminInfo/index'),
      },
      {
        path:'aboutMe',
        name:'aboutMe',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/aboutMe/index'),
      },
      {
        path:'label',
        name:'label',
        meta:
        {
          requireAuth: true,  // 添加该字段，表示进入这个路由是需要登录的
        },
        component:() => import('@/pages/admin/label/index'),
      },
      {
        path:'list',
        name:'list',
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

