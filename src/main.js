import Vue from 'vue'
import App from './App.vue'
import router from './router' // 必须引入

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router, // 关键！这里不能丢
  render: h => h(App),
}).$mount('#app')