/**
 * 购物车 Store：缓存列表、数量统计，与后端 /api/cart 同步
 */
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getCartList, addCart, removeCartItem } from '@/api/cart';

export const useCartStore = defineStore('cart', () => {
  const items = ref([]);
  const total = ref(0);
  const totalAmount = ref(0);

  const totalCount = computed(() => items.value.reduce((s, i) => s + (i.quantity || 0), 0));

  /** 从服务端拉取购物车（分页），返回 { list, total, totalAmount } */
  async function fetchCart(page = 1, pageSize = 10) {
    const data = await getCartList({ page, pageSize });
    items.value = data.list || [];
    total.value = data.total ?? 0;
    totalAmount.value = Number(data.totalAmount ?? 0);
    return data;
  }

  /** 添加商品到购物车；后端返回全量 list，直接覆盖当前页数据 */
  async function add(productId, quantity = 1) {
    const data = await addCart({ productId, quantity });
    items.value = data.list || [];
    total.value = data.total ?? 0;
    totalAmount.value = Number(data.totalAmount ?? 0);
    return data;
  }

  /** 删除购物车项（删除后需由调用方 fetchCart 刷新列表与 total） */
  async function remove(productId) {
    await removeCartItem(productId);
    items.value = items.value.filter((i) => i.product_id !== productId);
  }

  return { items, total, totalAmount, totalCount, fetchCart, add, remove };
});
