/**
 * Vue Router：首页、商品详情、购物车、登录、结算、订单
 * 需登录路由由 beforeEach 拦截，未登录直接跳转登录页，避免先发请求再跳转
 */
import { createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/HomeView.vue'), meta: { title: '首页' } },
  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetailView.vue'),
    meta: { title: '商品详情' },
  },
  { path: '/cart', name: 'Cart', component: () => import('@/views/CartView.vue'), meta: { title: '购物车', requiresAuth: true } },
  { path: '/checkout', name: 'Checkout', component: () => import('@/views/CheckoutView.vue'), meta: { title: '确认订单', requiresAuth: true } },
  { path: '/orders', name: 'Orders', component: () => import('@/views/OrderListView.vue'), meta: { title: '我的订单', requiresAuth: true } },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('@/views/OrderDetailView.vue'),
    meta: { title: '订单详情', requiresAuth: true },
  },
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue'), meta: { title: '登录' } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  const hasToken = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !hasToken) {
    next({ path: '/login', query: { redirect: to.fullPath } });
    return;
  }
  next();
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 水果店` : '水果店';
});

export default router;
