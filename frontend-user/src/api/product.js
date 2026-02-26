/**
 * 商品 API：列表、详情
 * 对应后端 ProductController
 */
import request from './request';

/** GET /api/products?page&pageSize → { list, total } */
export function getProductList(params) {
  return request.get('/api/products', { params });
}

/** GET /api/products/:id → 商品详情 */
export function getProductById(id) {
  return request.get(`/api/products/${id}`);
}
