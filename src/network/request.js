import axios from 'axios'
import {Message} from 'element-ui'

export function request(config) {
  // 创建 axios 实例
  const http = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    timeout: 5000
  })
  // 请求拦截器
  http.interceptors.request.use(config => {
    // 管理员请求头添加字段
    const adminToken = window.sessionStorage.getItem('token')
    if (adminToken) {
      config.headers.AdminAuthorization = adminToken
    }

    // 用户请求头添加 Authorization 字段
    config.headers.Authorization = window.localStorage.getItem('token')?window.localStorage.getItem('token'):''
    return config;
  }, err => {
    console.log(err);
  })
  // 响应拦截器
  http.interceptors.response.use(res => {
    // if(res.data.meta.status !== 200) {
    //   Message({
    //     message: res.data.meta.msg,
    //     type: 'warning',
    //     duration: 3000
    //   })
    // }
    return res.data
  },err => {
    console.log(err);
    Message({
      message: err.data.meta.msg,
      type: 'warning',
      duration: 3000
    })
  })
  // 返回创建的网络请求实例
  return http(config)
}