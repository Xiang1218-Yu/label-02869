/**
 * 购物车 API：列表、添加、删除
 * 对应后端 CartController，需登录
 */
import request from './request';

/** GET /api/cart?page=1&pageSize=10 → { list, total, totalAmount } */
export function getCartList(params) {
  return request.get('/api/cart', { params });
}

/** POST /api/cart → { productId, quantity? }，返回更新后的列表 */
export function addCart(data) {
  return request.post('/api/cart', data);
}

/** DELETE /api/cart/:productId */
export function removeCartItem(productId) {
  return request.delete(`/api/cart/${productId}`);
}
