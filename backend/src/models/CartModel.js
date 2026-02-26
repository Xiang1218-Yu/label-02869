/**
 * 购物车 Model：负责 cart_item 表 CRUD
 */
const db = require('../db');

/**
 * 查询用户的购物车列表（联表商品信息），支持分页
 * @param {number} userId
 * @param {object} opts - { page, pageSize }
 * @returns {Promise<{ list: array, total: number, totalAmount: number }>}
 */
async function listByUserId(userId, opts = {}) {
  const page = Math.max(1, parseInt(opts.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(opts.pageSize, 10) || 20));
  const offset = (page - 1) * pageSize;

  const [[{ total }]] = await db.execute(
    'SELECT COUNT(*) AS total FROM cart_item WHERE user_id = ?',
    [userId]
  );
  const [sumRows] = await db.execute(
    `SELECT SUM(p.price * c.quantity) AS total_amount
     FROM cart_item c JOIN product p ON p.id = c.product_id WHERE c.user_id = ?`,
    [userId]
  );
  const totalAmount = Number(sumRows[0]?.total_amount || 0);

  const limitNum = Number(pageSize);
  const offsetNum = Number(offset);
  const [list] = await db.query(
    `SELECT c.id, c.user_id, c.product_id, c.quantity, c.updated_at,
            p.name AS product_name, p.cover_url, p.price, p.unit, p.stock
     FROM cart_item c
     JOIN product p ON p.id = c.product_id
     WHERE c.user_id = ?
     ORDER BY c.updated_at DESC
     LIMIT ${limitNum} OFFSET ${offsetNum}`,
    [userId]
  );
  return { list, total, totalAmount };
}

/**
 * 添加或更新购物车项（存在则加数量）
 * @param {number} userId
 * @param {number} productId
 * @param {number} quantity - 本次增加数量，默认 1
 * @returns {Promise<object>}
 */
async function upsert(userId, productId, quantity = 1) {
  const [existing] = await db.execute(
    'SELECT id, quantity FROM cart_item WHERE user_id = ? AND product_id = ? LIMIT 1',
    [userId, productId]
  );
  if (existing.length) {
    const newQty = existing[0].quantity + quantity;
    await db.execute('UPDATE cart_item SET quantity = ?, updated_at = NOW() WHERE id = ?', [
      newQty,
      existing[0].id,
    ]);
    return { id: existing[0].id, quantity: newQty };
  }
  const [result] = await db.execute(
    'INSERT INTO cart_item (user_id, product_id, quantity) VALUES (?, ?, ?)',
    [userId, productId, quantity]
  );
  return { id: result.insertId, quantity };
}

/**
 * 删除用户某商品的购物车项
 * @param {number} userId
 * @param {number} productId
 * @returns {Promise<boolean>} 是否删除了记录
 */
async function remove(userId, productId) {
  const [result] = await db.execute('DELETE FROM cart_item WHERE user_id = ? AND product_id = ?', [
    userId,
    productId,
  ]);
  return result.affectedRows > 0;
}

module.exports = { listByUserId, upsert, remove };
