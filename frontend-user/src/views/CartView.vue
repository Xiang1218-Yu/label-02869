<template>
  <div class="cart-view">
    <div class="page-header">
      <h1 class="page-title">购物车</h1>
      <span v-if="cartStore.total > 0" class="page-extra"
        >共 {{ cartStore.total }} 件商品</span
      >
    </div>
    <el-skeleton v-if="loading" :rows="4" animated />
    <div v-else-if="!userStore.isLoggedIn" class="empty">
      <el-empty description="请先登录">
        <router-link to="/login">
          <el-button type="primary">去登录</el-button>
        </router-link>
      </el-empty>
    </div>
    <div v-else-if="cartStore.total === 0" class="empty">
      <el-empty description="购物车是空的">
        <router-link to="/">
          <el-button type="primary">去逛逛</el-button>
        </router-link>
      </el-empty>
    </div>
    <div v-else class="cart-card">
      <div v-for="item in cartStore.items" :key="item.id" class="cart-item">
        <img
          :src="item.cover_url || placeholderImg"
          :alt="item.product_name"
          class="item-cover"
        />
        <div class="item-info">
          <div class="item-name">{{ item.product_name }}</div>
          <div class="item-meta">
            ¥ {{ Number(item.price || 0).toFixed(2) }} / {{ item.unit }}
          </div>
        </div>
        <div class="item-quantity">
          <el-input-number
            v-model="item.quantity"
            :min="1"
            :max="item.stock"
            size="small"
            @change="handleQuantityChange(item.product_id, item.quantity)"
          />
        </div>
        <div class="item-total">
          ¥ {{ (Number(item.price || 0) * (item.quantity || 0)).toFixed(2) }}
        </div>
        <el-button
          type="danger"
          link
          :loading="removingId === item.product_id"
          @click="handleRemove(item.product_id)"
        >
          删除
        </el-button>
      </div>
      <div class="cart-footer">
        <span class="total-label">合计：</span>
        <span class="total-amount"
          >¥ {{ Number(cartStore.totalAmount).toFixed(2) }}</span
        >
        <el-button type="primary" size="large" @click="handleCheckout">去结算</el-button>
      </div>
      <el-pagination
        v-if="cartStore.total > 0"
        class="pagination"
        :current-page="cartPage"
        :page-size="cartPageSize"
        :page-sizes="[5, 10, 20]"
        :total="cartStore.total"
        layout="total, sizes, prev, pager, next"
        @current-change="onCartPageChange"
        @size-change="onCartSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * 购物车页：从 useCartStore 拉取列表（需登录），展示数量与总价，支持删除和调整数量
 */
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCartStore } from "@/stores/cart";
import { useUserStore } from "@/stores/user";

const loading = ref(true);
const removingId = ref(null);
const cartPage = ref(1);
const cartPageSize = ref(10);
const cartStore = useCartStore();
const userStore = useUserStore();
const router = useRouter();

const placeholderImg =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="#f0f0f0" width="80" height="80"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12">图</text></svg>',
  );

async function loadCart() {
  if (!userStore.isLoggedIn) {
    loading.value = false;
    return;
  }
  try {
    await cartStore.fetchCart(cartPage.value, cartPageSize.value);
  } finally {
    loading.value = false;
  }
}

function onCartPageChange(p) {
  cartPage.value = p;
  cartStore.fetchCart(cartPage.value, cartPageSize.value);
}

function onCartSizeChange(size) {
  cartPageSize.value = size;
  cartPage.value = 1;
  cartStore.fetchCart(cartPage.value, cartPageSize.value);
}

async function handleRemove(productId) {
  ElMessageBox.confirm("你确定要移除该水果吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      removingId.value = productId;
      try {
        await cartStore.remove(productId);
        ElMessage.success("已移除");
        await cartStore.fetchCart(cartPage.value, cartPageSize.value);
      } finally {
        removingId.value = null;
      }
    })
    .catch(() => {});
}

async function handleQuantityChange(productId, quantity) {
  try {
    await cartStore.update(productId, quantity);
  } catch (e) {
    // 错误已在 request 拦截器提示
    await cartStore.fetchCart(cartPage.value, cartPageSize.value);
  }
}

function handleCheckout() {
  if (cartStore.items.length === 0) {
    ElMessage.warning("购物车是空的");
    return;
  }
  router.push("/checkout");
}

onMounted(() => loadCart());
</script>

<style lang="scss" scoped>
.cart-view {
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin: 0 0 var(--spacing-md);
  }
  .page-title {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
  }
  .page-extra {
    font-size: 14px;
    color: var(--text-secondary);
  }
  .empty {
    padding: var(--spacing-md);
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
  }
  .cart-card {
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    padding: var(--spacing-sm);
  }

  .cart-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--border);

    .item-cover {
      width: 64px;
      height: 64px;
      object-fit: cover;
      border-radius: var(--radius-btn);
      background: #f0f0f0;
    }
    .item-info {
      flex: 1;
      min-width: 0;
    }
    .item-name {
      font-weight: 500;
    }
    .item-meta {
      font-size: 12px;
      color: var(--text-secondary);
    }
    .item-qty {
      color: var(--text-secondary);
    }
    .item-quantity {
      min-width: 120px;
    }
    .item-total {
      font-weight: 600;
      color: var(--primary);
      min-width: 80px;
      text-align: right;
    }
  }
  .cart-footer {
    margin-top: var(--spacing-sm);
    padding-top: var(--spacing-sm);
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: flex-end;
    .total-label {
      color: var(--text-secondary);
    }
    .total-amount {
      font-size: 20px;
      font-weight: 600;
      color: var(--primary);
    }
  }
  .pagination {
    margin-top: var(--spacing-sm);
    justify-content: center;
  }
}
</style>
