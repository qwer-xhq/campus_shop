import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/goods',
        name: 'Goods', 
        component: () => import(/* webpackChunkName: "home" */ '../views/goods/Goods.vue'),
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login/Login.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
