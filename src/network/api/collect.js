import { request } from "../request";

// 获得我的收藏
export function getMyCollect(params) {
  return request({
    url: 'collect',
    params,
  })
}

// 查询商品是否收藏
export function isCollect(id) {
  return request({
    url: 'collect/isCollect/'+id
  })
}

// 收藏商品
export function collect(id) {
  return request({
    url: 'collect/' + id
  })
}

// 取消收藏
export function cancelCollect(id) {
  return request({
    method:'delete',
    url: 'collect/' + id
  })
}