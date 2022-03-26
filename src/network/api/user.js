import {request} from '../request'

// 获取用户信息
export function getUserInfo () {
  return request({
    url: '/users/info'
  })
}

// 修改用户信息
export function modifyUserInfo(params) {
  return request({
    method: 'post',
    url: '/users/modify',
    data:params,
  })
}

// 修改密码
export function changePassword(params) {
  return request({
    method: 'post',
    url: '/users/changePwd',
    data: params
  })
}