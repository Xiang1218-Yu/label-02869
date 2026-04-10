/**
 * 订单 Service：创建订单、查询订单列表和详情、支付订单
 */
const OrderModel = require('../models/OrderModel');
const CartModel = require('../models/CartModel');
const ProductModel = require('../models/ProductModel');

/**
 * 创建订单（从购物车）
 * @param {number} userId
 * @returns {Promise<object>} { orderId }
 */
async function createFromCart(userId) {
  // 获取购物车数据
  const cartData = await CartModel.listByUserId(userId, { page: 1, pageSize: 9999 });
  if (!cartData.list || cartData.list.length === 0) {
    throw new Error('购物车是空的');
  }

  // 验证库存并准备订单项
  const items = [];
  let totalAmount = 0;

  for (const cartItem of cartData.list) {
    const product = await ProductModel.findById(cartItem.product_id);
    if (!product) {
      throw new Error(`商品 ${cartItem.product_name} 不存在`);
    }
    if (product.stock < cartItem.quantity) {
      throw new Error(`商品 ${cartItem.product_name} 库存不足`);
    }

    items.push({
      productId: cartItem.product_id,
      quantity: cartItem.quantity,
      price: product.price,
    });
    totalAmount += product.price * cartItem.quantity;
  }

  // 创建订单
  const result = await OrderModel.create(userId, { totalAmount, items });

  // 清空购物车
  for (const cartItem of cartData.list) {
    await CartModel.remove(userId, cartItem.product_id);
  }

  return result;
}

/**
 * 查询用户订单列表
 * @param {number} userId
 * @param {object} opts - Controller 传入 { current, size }，此处转为 Model 的 page / pageSize
 * @returns {Promise<{ list: array, total: number }>}
 */
async function list(userId, opts = {}) {
  return OrderModel.listByUserId(userId, {
    page: opts.current || opts.page,
    pageSize: opts.size || opts.pageSize,
  });
}

/**
 * 查询订单详情
 * @param {number} orderId
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
async function getById(orderId, userId) {
  return OrderModel.findById(orderId, userId);
}

/**
 * 支付订单（模拟）
 * @param {number} orderId
 * @param {number} userId
 * @returns {Promise<object>}
 */
async function pay(orderId, userId) {
  const order = await OrderModel.findById(orderId, userId);
  if (!order) {
    throw new Error('订单不存在');
  }
  if (order.status === 'paid') {
    throw new Error('订单已支付');
  }
  if (order.status === 'cancelled') {
    throw new Error('订单已取消，无法支付');
  }

  // 模拟支付处理（实际应该调用支付网关）
  await OrderModel.updateStatus(orderId, 'paid');
  
  return { success: true, message: '支付成功' };
}

module.exports = { createFromCart, list, getById, pay };
