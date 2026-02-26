/**
 * JWT 认证中间件
 * 从 Header Authorization: Bearer <token> 解析出 userId，写入 req.userId
 * 无效或缺失时返回 401
 */
const jwt = require('jsonwebtoken');
const config = require('../config');

function auth(req, res, next) {
  const raw = req.headers.authorization;
  if (!raw || !raw.startsWith('Bearer ')) {
    return res.status(401).json({ code: 401, message: '请先登录' });
  }
  const token = raw.slice(7);
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ code: 401, message: '登录已过期或无效，请重新登录' });
  }
}

module.exports = auth;
