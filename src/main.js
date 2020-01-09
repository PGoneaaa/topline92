import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 引入初始化样式
import '@/assets/css/global.css'
import ElementUI from 'element-ui'
import '@/utils/ax.js'

// 导入axios模块

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
