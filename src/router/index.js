import Vue from 'vue'
import VueRouter from 'vue-router'
// 路径必须是 ../views/LoginPage.vue
import LoginPage from '../views/LoginPage.vue'
import AdminPage from '../views/AdminPage.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage
  },
  {
    path: '/admin',
    name: 'AdminPage',
    component: AdminPage
  },
  {
    path: '/',
    redirect: '/login'
  }
]

const router = new VueRouter({
  mode: 'history', // 可选，不加也能用
  routes
})

export default router