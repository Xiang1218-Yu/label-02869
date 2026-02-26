/**
 * Axios 实例：baseURL、请求拦截器（注入 Token）、响应拦截器（统一错误与 Message）
 */
import axios from 'axios';
import { ElMessage } from 'element-plus';

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '',
  timeout: 10000,
});

// 请求拦截：从 localStorage 取 token 写入 Header
request.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 响应拦截：业务 code 非 0 或 HTTP 错误时提示并可选跳转登录；成功时返回后端 data 字段便于调用方直接使用
request.interceptors.response.use(
  (res) => {
    const body = res.data ?? {};
    const { code, message, data } = body;
    if (code !== 0 && code !== undefined) {
      ElMessage.error(message || '请求失败');
      if (code === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/#/login';
      }
      return Promise.reject(new Error(message));
    }
    return data !== undefined ? data : body;
  },
  (err) => {
    const msg = err.response?.data?.message || err.message || '网络错误';
    ElMessage.error(msg);
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/#/login';
    }
    return Promise.reject(err);
  }
);

export default request;
