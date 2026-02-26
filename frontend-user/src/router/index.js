/**
 * Vue Router：首页、商品详情、购物车、登录
 * 无路由守卫，未登录访问购物车时由 API 401 后跳转登录
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
  { path: '/cart', name: 'Cart', component: () => import('@/views/CartView.vue'), meta: { title: '购物车' } },
  { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue'), meta: { title: '登录' } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - 水果店` : '水果店';
});

export default router;
