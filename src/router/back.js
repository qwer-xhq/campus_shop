import Admin from 'views/admin/Admin.vue'

export default [
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
  },
  {
    path: '/admin/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "admin" */ 'views/admin/childComps/home/Home.vue'),
    redirect: '/admin/Welcome',
    children: [
      {
        path: '/admin/Welcome', 
        name: 'Users', 
        component: () => import(/* webpackChunkName: "admin" */ 'views/admin/childComps/home/childComps/Welcome')
      },
      {
        path: '/admin/users', 
        name: 'Users', 
        component: () => import(/* webpackChunkName: "admin" */ 'views/admin/childComps/users/Users.vue')
      },
      {
        path: '/admin/goods', 
        name: 'GoodsList', 
        component: () => import(/* webpackChunkName: "admin" */ 'views/admin/childComps/goods/GoodsList.vue')
      },
      {
        path: '/admin/categories', 
        name: 'Categories', 
        component: () => import(/* webpackChunkName: "admin" */ 'views/admin/childComps/categories/Categories.vue')
      },
    ]
  }
]