/**
 * 购物车 Controller：列表、添加、删除、更新数量
 * 所有接口需要登录（由 auth 中间件注入 req.userId）
 */
const CartService = require('../services/CartService');

/**
 * GET /api/cart?page=1&pageSize=10
 * 返回 { list, total, totalAmount }
 */
async function list(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 10;
    const result = await CartService.list(req.userId, { page, pageSize });
    res.json({ code: 0, data: result });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/cart
 * 入参：{ productId, quantity? }
 */
async function add(req, res, next) {
  try {
    const productId = parseInt(req.body?.productId, 10);
    const quantity = parseInt(req.body?.quantity, 10) || 1;
    if (Number.isNaN(productId) || productId < 1) {
      return res.status(400).json({ code: 400, message: '商品ID无效' });
    }
    await CartService.add(req.userId, productId, quantity);
    const result = await CartService.list(req.userId, { page: 1, pageSize: 9999 });
    res.json({ code: 0, data: result });
  } catch (e) {
    if (e.message === '商品不存在' || e.message === '数量至少为 1') {
      return res.status(400).json({ code: 400, message: e.message });
    }
    next(e);
  }
}

/**
 * PUT /api/cart/:productId
 * 入参：{ quantity }
 */
async function update(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    const quantity = parseInt(req.body?.quantity, 10);
    if (Number.isNaN(productId) || productId < 1) {
      return res.status(400).json({ code: 400, message: '商品ID无效' });
    }
    if (Number.isNaN(quantity) || quantity < 1) {
      return res.status(400).json({ code: 400, message: '数量至少为 1' });
    }
    await CartService.update(req.userId, productId, quantity);
    const result = await CartService.list(req.userId, { page: 1, pageSize: 9999 });
    res.json({ code: 0, data: result });
  } catch (e) {
    if (e.message === '购物车中无该商品') {
      return res.status(404).json({ code: 404, message: e.message });
    }
    next(e);
  }
}

/**
 * DELETE /api/cart/:productId
 */
async function remove(req, res, next) {
  try {
    const productId = parseInt(req.params.productId, 10);
    if (Number.isNaN(productId)) {
      return res.status(400).json({ code: 400, message: '商品ID无效' });
    }
    await CartService.remove(req.userId, productId);
    res.json({ code: 0, data: { success: true } });
  } catch (e) {
    if (e.message === '购物车中无该商品') {
      return res.status(404).json({ code: 404, message: e.message });
    }
    next(e);
  }
}

module.exports = { list, add, update, remove };
