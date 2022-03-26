import { request } from "../request";

export function authValidate() {
  return request({
    url: '/authValidate'
  })
}