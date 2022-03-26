import { request } from "../request";

// 获取所有商品
export function getGoods(params) {
  return request({
    url: 'goods',
    params: {
      queryText: params
    }
  })
}

// 获取我的商品
export function getMyGoods(params) {
  return request({
    url: 'goods/myGoods',
    params
  })
}

// 获取最新发布商品
export function getNewGoods() {
  return request({
    url: 'goods/newGoods'
  })
}

// 根据分类获取商品
export function getCateGoods(id) {
  return request({
    url: 'goods/category/'+id
  })
}

// 获取商品详情
export function getGoodsDetail(id) {
  return request({
    url: 'goods/'+id
  })
}

// 添加商品
export function addGoods(params) {
  return request({
    method: 'post',
    url: 'goods/addGoods',
    data: params,
  })
}

// 更新商品
export function updateGoods(params) {
  return request({
    method: 'post',
    url: 'goods/updateGoods',
    data: params,
  })
}

// 更新商品状态
export function updateGoodsState(id,params) {
  return request({
    method: 'put',
    url: 'goods/updateGoodsState/'+id,
    data:params
  })
}

// 删除商品
export function deleteGoods(id) {
  return request({
    method: 'delete',
    url: 'goods/'+id
  })
}
