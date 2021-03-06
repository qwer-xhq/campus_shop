import Home from '../views/home/Home.vue'

export default [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'HomeContent', 
        component: () => import(/* webpackChunkName: "home" */ 'views/home/childComps/homeContent/HomeContent.vue'),
      },
      {
        path: '/goods',
        name: 'Goods', 
        component: () => import(/* webpackChunkName: "home" */ 'views/goods/Goods.vue'),
      },
      {
        path: '/detail/:id',
        name: 'Detail',
        meta: {isAuth: true},
        component: () => import(/* webpackChunkName:"home" */ 'views/detail/Detail.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ 'views/login/Login.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    redirect: '/userinfo',
    meta: {isAuth: true},
    component: () => import(/* webpackChunkName: "user" */ 'views/profile/Profile.vue'),
    children: [
      {path: '/userinfo', name: 'UserInfo', meta: {isAuth: true}, component: () => import(/* webpackChunkName: "user" */ 'views/profile/childComps/userInfo/UserInfo')},
      {path: '/modifypwd', name: 'ModifyPwd', meta: {isAuth: true}, component: () => import(/* webpackChunkName: "user" */ 'views/profile/childComps/userInfo/ModifyPwd')},
      {path: '/mygoods', name: 'MyGoods', meta: {isAuth: true}, component: () => import(/* webpackChunkName: "user" */ 'views/profile/childComps/myGoods/MyGoods')},
      {path: '/release', name: 'ReleaseGoods', meta: {isAuth: true}, component: () => import(/* webpackChunkName: "user" */ 'views/profile/childComps/myGoods/ReleaseGoods')},
      {path: '/updategoods/:id', name: 'UpdateGoods', meta: {isAuth: true}, component: () => import(/* webpackChunkName: "user" */ 'views/profile/childComps/myGoods/UpdateGoods')},
      {path: '/collection', name: 'MyCollection', meta: {isAuth: true}, component: () => import(/* webpackChunkName: "user" */ 'views/profile/childComps/myCollection/MyCollection')},
    ]
  },
]