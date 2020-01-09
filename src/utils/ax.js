import Vue from 'vue'
// 引入axios
import axios from 'axios'

// 引入路由
import router from '@/router'

// 配置响应拦截器
axios.interceptors.response.use(function (response) {
  // 正常响应处理
  return response
}, function (error) {
  // 非正常响应处理(包括401)
  // console.dir(error) // 对象： config request response isAxiosError toJSON
  if (error.response.status === 401) {
    // token不ok(token在服务器端已经失效了，2个小时时效)
    // 强制用户重新登录系统，以刷新服务器端的token时效
    router.push('/login')
    // 不要给做错误提示了
    return new Promise(function () {}) // 空的Promise对象，没有机会执行catch，进而不做错误提示了
  }
  // return new Promise((resolve,reject)=>{
  // reject('获得文章失败！')
  // })
  return Promise.reject(error)
})

// 公共根地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
// 请求拦截器
axios.interceptors.request.use(function (config) {
  let userinfo = window.sessionStorage.getItem('userinfo')
  if (userinfo) {
    config.headers.Authorization = 'Bearer ' + JSON.parse(userinfo).token
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

// 把axios通过原型继承的方式配置给Vue，使得组件内部可以直接访问
// 后期在组件内部就可以通过 this.$http 的方式获得axios对象
// $http:就是自定义名称，可以为其他
Vue.prototype.$http = axios
