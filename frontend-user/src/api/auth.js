/**
 * 认证相关 API：登录、注册、获取当前用户
 * 对应后端 AuthController
 */
import request from './request';

/** POST /api/auth/login → { token, user } */
export function login(data) {
  return request.post('/api/auth/login', data);
}

/** POST /api/auth/register → { token, user } */
export function register(data) {
  return request.post('/api/auth/register', data);
}

/** GET /api/auth/me → 当前用户信息 */
export function getMe() {
  return request.get('/api/auth/me');
}
