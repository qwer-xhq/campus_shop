import { request } from "../request";

// 前台用户登录
export function userLogin(params) {
  return request({
    method: 'post',
    url: 'login',
    data: params
  })
}

// 注册
export function register(params) {
  return request({
    method: 'post',
    url: 'register',
    data: params
  })
}

// 后台管理员登录
export function adminLogin(params) {
  return request({
    method: 'post',
    url: 'login/admin',
    data: params
  })
}