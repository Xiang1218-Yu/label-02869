/**
 * 商品 Model：负责 product 表查询
 */
const db = require('../db');

/**
 * 分页查询商品列表，支持关键词搜索（名称、描述）
 * @param {object} opts - { page, pageSize, keyword? }
 * @returns {Promise<{ list: array, total: number }>}
 */
async function list(opts = {}) {
  const page = Math.max(1, parseInt(opts.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(opts.pageSize, 10) || 20));
  const offset = (page - 1) * pageSize;
  const limitNum = Number(pageSize);
  const offsetNum = Number(offset);

  const keyword = typeof opts.keyword === 'string' ? opts.keyword.trim() : '';
  const likeParam = keyword
    ? '%' + keyword.replace(/%/g, '\\%').replace(/_/g, '\\_') + '%'
    : null;

  let listSql, countSql, listParams, countParams;
  if (likeParam) {
    listSql = `SELECT * FROM \`product\` WHERE \`name\` LIKE ? OR \`description\` LIKE ? ORDER BY \`id\` ASC LIMIT ${limitNum} OFFSET ${offsetNum}`;
    listParams = [likeParam, likeParam];
    countSql = 'SELECT COUNT(*) AS `count` FROM `product` WHERE `name` LIKE ? OR `description` LIKE ?';
    countParams = [likeParam, likeParam];
  } else {
    listSql = `SELECT * FROM \`product\` ORDER BY \`id\` ASC LIMIT ${limitNum} OFFSET ${offsetNum}`;
    listParams = [];
    countSql = 'SELECT COUNT(*) AS `count` FROM `product`';
    countParams = [];
  }

  const [rows] = listParams.length
    ? await db.execute(listSql, listParams)
    : await db.query(listSql);
  const [[{ count }]] = await db.execute(countSql, countParams);
  return { list: rows, total: count };
}

/**
 * 按 ID 查询商品详情
 * @param {number} id
 * @returns {Promise<object|null>}
 */
async function findById(id) {
  const [rows] = await db.execute('SELECT * FROM `product` WHERE `id` = ? LIMIT 1', [id]);
  return rows[0] || null;
}

module.exports = { list, findById };
