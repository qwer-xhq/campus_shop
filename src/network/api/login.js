import { request } from "../request";

// 登录
export function login(params) {
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