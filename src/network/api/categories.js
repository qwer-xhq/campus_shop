import { request } from "../request";

// 获取商品分类
export function getGoodsCates() {
  return request({
    url: 'categories'
  })
}

// 添加商品分类
export function addCate(params) {
  return request({
    method: 'post',
    url: 'categories',
    data: params
  })
}
// 修改商品分类
export function updateCate(params) {
  return request({
    method: 'put',
    url: 'categories/' + params.cate_id,
    data: params
  })
}
// 删除商品分类
export function deleteCate(id) {
  return request({
    method: 'delete',
    url: 'categories/' + id,
  })
}