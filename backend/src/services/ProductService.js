/**
 * 商品 Service：列表、详情
 * 直接委托 Model，可在此层做缓存或组装
 */
const ProductModel = require('../models/ProductModel');

async function list(opts) {
  return ProductModel.list(opts);
}

async function getById(id) {
  const product = await ProductModel.findById(id);
  if (!product) throw new Error('商品不存在');
  return product;
}

module.exports = { list, getById };
