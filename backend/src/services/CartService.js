/**
 * 购物车 Service：列表、添加、更新、删除
 * 依赖 CartModel，校验商品是否存在
 */
const CartModel = require('../models/CartModel');
const ProductModel = require('../models/ProductModel');

async function list(userId, opts = {}) {
  return CartModel.listByUserId(userId, opts);
}

/**
 * 添加商品到购物车
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity
 */
async function add(userId, productId, quantity = 1) {
  const product = await ProductModel.findById(productId);
  if (!product) throw new Error('商品不存在');
  if (quantity < 1) throw new Error('数量至少为 1');
  return CartModel.upsert(userId, productId, quantity);
}

/**
 * 更新购物车商品数量
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity
 */
async function update(userId, productId, quantity) {
  if (quantity < 1) throw new Error('数量至少为 1');
  const ok = await CartModel.updateQuantity(userId, productId, quantity);
  if (!ok) throw new Error('购物车中无该商品');
  return { success: true };
}

async function remove(userId, productId) {
  const ok = await CartModel.remove(userId, productId);
  if (!ok) throw new Error('购物车中无该商品');
  return { success: true };
}

module.exports = { list, add, update, remove };
