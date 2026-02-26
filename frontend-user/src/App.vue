<template>
  <div class="app-layout">
    <header class="app-header">
      <router-link to="/" class="logo">水果店</router-link>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/cart">购物车</router-link>
        <template v-if="userStore.token">
          <span class="user-name">{{ userStore.user?.nickname || userStore.user?.username }}</span>
          <el-button type="primary" link @click="handleLogout">退出</el-button>
        </template>
        <router-link v-else to="/login">
          <el-button type="primary">登录</el-button>
        </router-link>
      </nav>
    </header>
    <main class="app-main">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script setup>
/**
 * 根组件：顶部导航 + 主内容区
 * 使用 useUserStore 获取登录态并展示退出/登录入口
 */
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();

function handleLogout() {
  userStore.logout();
  window.location.href = '/';
}
</script>

<style lang="scss" scoped>
.app-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--page-bg);
}
.app-header {
  height: 56px;
  padding: 0 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo {
  font-size: 20px;
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
}
.nav {
  display: flex;
  align-items: center;
  gap: 24px;
  a {
    color: var(--text);
    text-decoration: none;
    font-size: 14px;
    &.router-link-active { color: var(--primary); font-weight: 500; }
  }
  .user-name { font-size: 14px; color: var(--text-secondary); margin-right: 8px; }
}
.app-main {
  flex: 1;
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
