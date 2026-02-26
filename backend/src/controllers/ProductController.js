/**
 * 商品 Controller：商品列表、商品详情
 */
const ProductService = require('../services/ProductService');

/**
 * GET /api/products?page=1&pageSize=20&keyword=苹果
 */
async function list(req, res, next) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const pageSize = parseInt(req.query.pageSize, 10) || 20;
    const keyword = req.query.keyword;
    const result = await ProductService.list({ page, pageSize, keyword });
    res.json({ code: 0, data: result });
  } catch (e) {
    next(e);
  }
}

/**
 * GET /api/products/:id
 */
async function getById(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ code: 400, message: '商品ID无效' });
    }
    const product = await ProductService.getById(id);
    res.json({ code: 0, data: product });
  } catch (e) {
    if (e.message === '商品不存在') {
      return res.status(404).json({ code: 404, message: e.message });
    }
    next(e);
  }
}

module.exports = { list, getById };
