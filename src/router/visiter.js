

const CommonLayout = r => require.ensure([], () => r(require('@/components/commonLayout')), 'chunkname1')
const Home = r => require.ensure([], () => r(require('@/pages/home')), 'chunkname1')
const Archives = r => require.ensure([], () => r(require('@/pages/archives')), 'chunkname1')
const Categories = r => require.ensure([], () => r(require('@/pages/categories')), 'chunkname1')
const Collections = r => require.ensure([], () => r(require('@/pages/collections')), 'chunkname1')
const Demo = r => require.ensure([], () => r(require('@/pages/demo')), 'chunkname1')
const About = r => require.ensure([], () => r(require('@/pages/about')), 'chunkname1')
const Detail = r => require.ensure([], () => r(require('@/pages/detail')), 'chunkname2')
const Signin = r => require.ensure([], () => r(require('@/pages/signin')), 'chunkname1')
const VisiterIndex = r => require.ensure([], () => r(require('@/pages/visiter/index')), 'chunkname3')

export  default [
  {
    path: '/',
    component: CommonLayout,    // 组件下面又包含一个组件，通过router-view显示
    children:[
      {
        path: '',
        component: Home,
        name:'home'
      },
      {
        path: '/archives',
        component: Archives,
        name:'archives',
      },
      {
        path: '/detail/:id',
        component: Detail,
      },
      {
        path: '/categories',
        component: Categories,
        name:'categories'
      },
      {
        path: '/collections',
        component: Collections,
        name:'collections'
      },
      {
        path: '/demo',
        component: Demo,
        name:'demo'
      },
      {
        path: '/about',
        component: About,
        name:'about'
      },
      {
        path: '/visiter',
        component: VisiterIndex,
        name:'visiter'
      },
    ]
  },
  {
    path: '/sign',
    component: Signin,
    name:'Signin',
    alias: '/admin',
  },
]
