<template>
  <div class="app-layout">
    <header class="app-header">
      <router-link to="/" class="logo">水果店</router-link>
      <nav class="nav">
        <router-link to="/">首页</router-link>
        <router-link to="/cart" class="cart-link">
          购物车
          <el-badge v-if="cartStore.totalCount > 0" :value="cartStore.totalCount" :max="99" class="cart-badge" />
        </router-link>
        <router-link v-if="userStore.token" to="/orders">我的订单</router-link>
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
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
import { useCartStore } from '@/stores/cart';

const userStore = useUserStore();
const cartStore = useCartStore();

// 初始化时加载购物车数量
onMounted(() => {
  if (userStore.isLoggedIn) {
    cartStore.fetchCart(1, 9999);
  }
});

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
  height: 60px;
  padding: 0 var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 0;
  z-index: 100;
}
.logo {
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--primary);
  text-decoration: none;
  transition: opacity var(--transition);
}
.logo:hover { opacity: 0.88; }
.nav {
  display: flex;
  align-items: center;
  gap: 28px;
  a {
    color: var(--text);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    transition: color var(--transition);
    &.router-link-active { color: var(--primary); font-weight: 600; }
  }
  a:hover:not(.router-link-active) { color: var(--primary-light); }
  .cart-link {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .cart-badge {
    :deep(.el-badge__content) {
      transform: translateY(-50%) translateX(0);
    }
  }
  .user-name { font-size: 14px; color: var(--text-secondary); margin-right: 4px; }
}
.app-main {
  flex: 1;
  padding: var(--spacing-md);
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}
.fade-enter-active,
.fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
</style>
