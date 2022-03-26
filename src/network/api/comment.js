import {request} from '../request'

// 获取商品评论
export function getCommentsByGoodsId(id) {
  return request({
    url: 'comment/'+id
  })
}

// 发送评论
export function sendComments(id,params) {
  return request({
    method: 'post',
    url: 'comment/'+id,
    data: {
      "content": params
    }
  })
}