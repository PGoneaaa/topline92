import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [

  // 1.import xxx from xxx  模块化导入
  // 2.import(xxx)函数调用
  // 它们不是一回事
  // 下面调用函数，按需导入

  // @代表src目录的绝对路径名地址

  // index。vue 是默认索引文件，不用设置，代码更节省，优雅
  // 设置name属性作用，为了编程式导航
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/home',
    name: 'home',
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'welcome', component: () => import('@/views/welcome') },
      { path: '/article', name: 'article', component: () => import('@/views/article') }
    ],
    component: () => import('@/views/home')
  }
]

const router = new VueRouter({
  routes
})

// 配置全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 获得用户登陆状态信息
  let userinfo = window.sessionStorage.getItem('userinfo')
  // 登陆状态：userinfo是大字符串， 非登陆状态：userinfo是null
  if (!userinfo && to.path !== '/login') {
    return next('/login')
  }
  next()
})

export default router
