import { request } from "../request";

// 用户验证token
export function userAuthValidate() {
  return request({
    url: '/authValidate/user'
  })
}
// 管理员验证token
export function adminAuthValidate() {
  return request({
    url: '/authValidate/admin'
  })
}