/**
 * 用户 Model：负责 user 表 CRUD
 */
const db = require('../db');

/**
 * 按用户名查询用户（用于登录）
 * @param {string} username
 * @returns {Promise<object|null>}
 */
async function findByUsername(username) {
  const [rows] = await db.execute('SELECT * FROM `user` WHERE `username` = ? LIMIT 1', [username]);
  return rows[0] || null;
}

/**
 * 按 ID 查询用户（不含密码）
 * @param {number} id
 * @returns {Promise<object|null>}
 */
async function findById(id) {
  const [rows] = await db.execute(
    'SELECT `id`, `username`, `nickname`, `created_at` FROM `user` WHERE `id` = ? LIMIT 1',
    [id]
  );
  return rows[0] || null;
}

/**
 * 创建用户（注册）
 * @param {object} data - { username, password_hash, nickname }
 * @returns {Promise<object>} 插入后的用户（含 id）
 */
async function create(data) {
  const [result] = await db.execute(
    'INSERT INTO `user` (`username`, `password_hash`, `nickname`) VALUES (?, ?, ?)',
    [data.username, data.password_hash, data.nickname || data.username]
  );
  return { id: result.insertId, username: data.username, nickname: data.nickname || data.username };
}

module.exports = { findByUsername, findById, create };
