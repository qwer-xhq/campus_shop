import { request } from "../request";

// 获取商品
export function getGoods() {
  return request({
    url: 'goods',
  })
}
// 获取商品分类
export function getGoodsCates() {
  return request({
    url: 'goods/categories'
  })
}
