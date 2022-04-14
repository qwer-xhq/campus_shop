import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/home/Home.vue'
import Admin from '../views/admin/Admin.vue'
import {Message} from 'element-ui'
import front from './front'
import back from './back'
Vue.use(VueRouter)

const routes = [
  // 前台路由接口
  ...front,
  // 后台路由接口
  ...back,
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.isAuth) {
    if(localStorage.getItem('token')) {
      next()
    } else {
      Message.error('当前未登录或登录失效，请重新登录！')
      next('/login')
    }
  }else{
    next()
  }
  
})

export default router
