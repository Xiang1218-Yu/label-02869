/**
 * 订单 API：创建订单、查询订单列表和详情、支付订单
 * 对应后端 OrderController，需登录
 */
import request from './request';

/** POST /api/orders → 从购物车创建订单 */
export function createOrder() {
  return request.post('/api/orders');
}

/** GET /api/orders → { list, total } */
export function getOrderList(params) {
  return request.get('/api/orders', {
    params: {
      page: params.page,
      pageSize: params.pageSize,
    },
  });
}

/** GET /api/orders/:id → 订单详情 */
export function getOrderDetail(id) {
  return request.get(`/api/orders/${id}`);
}

/** POST /api/orders/:id/pay → 支付订单（模拟） */
export function payOrder(id) {
  return request.post(`/api/orders/${id}/pay`);
}
