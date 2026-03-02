/**
 * 订单 Model：负责 order 和 order_item 表 CRUD
 */
const db = require('../db');

/**
 * 创建订单（包含订单项）
 * @param {number} userId
 * @param {object} orderData - { totalAmount, items: [{ productId, quantity, price }] }
 * @returns {Promise<object>} { orderId }
 */
async function create(userId, orderData) {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    // 插入订单主表
    const [orderResult] = await conn.execute(
      'INSERT INTO `order` (user_id, total_amount, status) VALUES (?, ?, ?)',
      [userId, orderData.totalAmount, 'pending']
    );
    const orderId = orderResult.insertId;

    // 插入订单项
    if (orderData.items && orderData.items.length > 0) {
      const values = orderData.items.map((item) => [
        orderId,
        item.productId,
        item.quantity,
        item.price,
      ]);
      await conn.query(
        'INSERT INTO order_item (order_id, product_id, quantity, price) VALUES ?',
        [values]
      );
    }

    await conn.commit();
    return { orderId };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

/**
 * 查询用户订单列表（分页）
 * @param {number} userId
 * @param {object} opts - { page, pageSize }
 * @returns {Promise<{ list: array, total: number }>}
 */
async function listByUserId(userId, opts = {}) {
  const page = Math.max(1, parseInt(opts.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(opts.pageSize, 10) || 10));
  const offset = (page - 1) * pageSize;

  const [[{ total }]] = await db.execute(
    'SELECT COUNT(*) AS total FROM `order` WHERE user_id = ?',
    [userId]
  );

  const limitNum = Number(pageSize);
  const offsetNum = Number(offset);
  const [list] = await db.query(
    `SELECT id, user_id, total_amount, status, created_at
     FROM \`order\`
     WHERE user_id = ?
     ORDER BY created_at DESC
     LIMIT ${limitNum} OFFSET ${offsetNum}`,
    [userId]
  );

  return { list, total };
}

/**
 * 根据订单 ID 查询订单详情（包含订单项）
 * @param {number} orderId
 * @param {number} userId - 用于权限校验
 * @returns {Promise<object|null>}
 */
async function findById(orderId, userId) {
  const [orders] = await db.execute(
    'SELECT id, user_id, total_amount, status, created_at FROM `order` WHERE id = ? AND user_id = ? LIMIT 1',
    [orderId, userId]
  );
  if (orders.length === 0) return null;

  const order = orders[0];
  const [items] = await db.execute(
    `SELECT oi.id, oi.product_id, oi.quantity, oi.price,
            p.name AS product_name, p.cover_url, p.unit
     FROM order_item oi
     JOIN product p ON p.id = oi.product_id
     WHERE oi.order_id = ?`,
    [orderId]
  );

  order.items = items;
  return order;
}

module.exports = { create, listByUserId, findById };
