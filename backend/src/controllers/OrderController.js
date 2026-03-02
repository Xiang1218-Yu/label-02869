/**
 * 订单 Controller：创建订单、查询订单列表和详情
 * 所有接口需要登录（由 auth 中间件注入 req.userId）
 */
const OrderService = require('../services/OrderService');

/**
 * POST /api/orders
 * 从购物车创建订单
 */
async function create(req, res, next) {
  try {
    const result = await OrderService.createFromCart(req.userId);
    res.status(201).json({ code: 0, data: result });
  } catch (e) {
    if (e.message === '购物车是空的' || e.message.includes('库存不足') || e.message.includes('不存在')) {
      return res.status(400).json({ code: 400, message: e.message });
    }
    next(e);
  }
}

/**
 * GET /api/orders?page=1&pageSize=10
 * 查询用户订单列表
 */
async function list(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const result = await OrderService.list(req.userId, { page, pageSize });
    res.json({ code: 0, data: result });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/orders/:id
 * 查询订单详情
 */
async function getById(req, res, next) {
  try {
    const orderId = parseInt(req.params.id, 10);
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ code: 400, message: '订单ID无效' });
    }
    const order = await OrderService.getById(orderId, req.userId);
    if (!order) {
      return res.status(404).json({ code: 404, message: '订单不存在' });
    }
    res.json({ code: 0, data: order });
  } catch (e) {
    next(e);
  }
}

module.exports = { create, list, getById };
