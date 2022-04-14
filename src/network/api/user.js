import {request} from '../request'

// 获取用户列表
export function getUserList(params) {
  return request({
    url: 'users',
    params,
  })
}

// 获取用户信息
export function getUserInfo () {
  return request({
    url: 'users/info'
  })
}

// 修改用户信息
export function modifyUserInfo(params) {
  return request({
    method: 'post',
    url: 'users/modify',
    data:params,
  })
}

// 修改密码
export function changePassword(params) {
  return request({
    method: 'post',
    url: 'users/changePwd',
    data: params
  })
}

// 修改用户状态
export function changeUserState(params) {
  return request({
    method: 'post',
    url: 'users/changeUserState',
    data: params
  })
}

// 管理员修改用户信息
export function mgModifyUser(params) {
  return request({
    method: 'post',
    url: 'users/mgModifyUser',
    data: params
  })
}

// 修改用户角色
export function changeUserRole(params) {
  return request({
    method: 'post',
    url: 'users/changeUserRole',
    data: params
  })
}

// 删除用户
export function deleteUser(id) {
  return request({
    method: 'delete',
    url: 'users/'+id
  })
}