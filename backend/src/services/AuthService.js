/**
 * 认证 Service：登录、注册、获取当前用户
 * 依赖 UserModel，封装密码校验与 JWT 生成（在 Controller 中生成 token，此处只做业务校验）
 */
const bcrypt = require('bcryptjs');
const UserModel = require('../models/UserModel');

/**
 * 登录校验：验证用户名密码，返回用户信息（不含密码）
 * @param {string} username
 * @param {string} password
 * @returns {Promise<object|null>} 成功返回 { id, username, nickname }，失败 null
 */
async function login(username, password) {
  const user = await UserModel.findByUsername(username);
  if (!user) return null;
  const ok = bcrypt.compareSync(password, user.password_hash);
  if (!ok) return null;
  return { id: user.id, username: user.username, nickname: user.nickname };
}

/**
 * 注册：校验用户名是否已存在，写入密码哈希后创建用户
 * @param {string} username
 * @param {string} password
 * @param {string} [nickname]
 * @returns {Promise<object>} 创建后的用户信息
 * @throws 用户名已存在时抛出 Error
 */
async function register(username, password, nickname) {
  const exist = await UserModel.findByUsername(username);
  if (exist) throw new Error('用户名已存在');
  const password_hash = bcrypt.hashSync(password, 10);
  const created = await UserModel.create({ username, password_hash, nickname });
  return created;
}

/**
 * 根据用户 ID 获取当前用户信息（供 /api/auth/me 使用）
 * @param {number} userId
 * @returns {Promise<object|null>}
 */
async function getMe(userId) {
  return UserModel.findById(userId);
}

module.exports = { login, register, getMe };
