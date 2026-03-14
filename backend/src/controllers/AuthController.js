/**
 * 认证 Controller：登录、注册、获取当前用户
 * 使用 AuthService 处理业务，生成 JWT 并返回统一响应格式
 */
const jwt = require('jsonwebtoken');
const config = require('../config');
const AuthService = require('../services/AuthService');

/**
 * POST /api/auth/login
 * 入参：{ username, password }
 * 返回：{ token, user: { id, username, nickname } }
 */
async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '缺少必填参数：用户名和密码' });
    }
    const user = await AuthService.login(username, password);
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    res.json({ code: 0, data: { token, user } });
  } catch (e) {
    next(e);
  }
}

/**
 * POST /api/auth/register
 * 入参：{ username, password, nickname? }
 */
async function register(req, res, next) {
  try {
    const { username, password, nickname } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ code: 400, message: '缺少必填参数：用户名和密码' });
    }
    const user = await AuthService.register(username, password, nickname);
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
    res.status(201).json({ code: 0, data: { token, user } });
  } catch (e) {
    if (e.message === '用户名已存在') {
      return res.status(400).json({ code: 400, message: e.message });
    }
    next(e);
  }
}

/**
 * GET /api/auth/me
 * 需 Authorization: Bearer <token>
 */
async function me(req, res, next) {
  try {
    const user = await AuthService.getMe(req.userId);
    if (!user) {
      return res.status(401).json({ code: 401, message: '用户不存在或已失效' });
    }
    res.json({ code: 0, data: user });
  } catch (e) {
    next(e);
  }
}

module.exports = { login, register, me };
