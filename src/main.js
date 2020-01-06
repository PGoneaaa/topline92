import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入初始化样式
import '@/assets/css/global.css'
import ElementUI from 'element-ui'

// 导入axios模块
import axios from 'axios'
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/'
Vue.prototype.$http = axios
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
