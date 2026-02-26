/**
 * 用户状态：token、user 持久化到 localStorage，提供 login/logout/refresh
 * 使用 Pinia defineStore
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { login as apiLogin, register as apiRegister, getMe } from '@/api/auth';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem(TOKEN_KEY) || '');
  const user = ref(JSON.parse(localStorage.getItem(USER_KEY) || 'null'));

  const isLoggedIn = computed(() => !!token.value);

  /** 登录：调用 login API，写入 token 与 user */
  async function login(credentials) {
    const data = await apiLogin(credentials);
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  }

  /** 注册：调用 register API，写入 token 与 user */
  async function register(payload) {
    const data = await apiRegister(payload);
    token.value = data.token;
    user.value = data.user;
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    return data;
  }

  /** 退出：清空内存与 localStorage */
  function logout() {
    token.value = '';
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /** 刷新当前用户信息（如从 /api/auth/me 拉取） */
  async function refreshUser() {
    if (!token.value) return;
    const u = await getMe();
    user.value = u;
    localStorage.setItem(USER_KEY, JSON.stringify(u));
  }

  return { token, user, isLoggedIn, login, register, logout, refreshUser };
});
