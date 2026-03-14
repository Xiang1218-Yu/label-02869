<template>
  <div class="checkout-view">
    <h1 class="page-title">确认订单</h1>

    <el-skeleton v-if="loading" :rows="6" animated />
    <div v-else-if="cartStore.total === 0" class="empty">
      <el-empty description="购物车是空的">
        <router-link to="/">
          <el-button type="primary">去逛逛</el-button>
        </router-link>
      </el-empty>
    </div>
    <div v-else class="checkout-card">
      <div class="section">
        <h3 class="section-title">商品清单</h3>
        <div v-for="item in cartStore.items" :key="item.id" class="order-item">
          <img
            :src="item.cover_url || placeholderImg"
            :alt="item.product_name"
            class="item-cover"
          />
          <div class="item-info">
            <div class="item-name">{{ item.product_name }}</div>
            <div class="item-meta">
              ¥ {{ Number(item.price || 0).toFixed(2) }} / {{ item.unit }} × {{ item.quantity }}
            </div>
          </div>
          <div class="item-total">
            ¥ {{ (Number(item.price || 0) * (item.quantity || 0)).toFixed(2) }}
          </div>
        </div>
      </div>

      <div class="section">
        <div class="summary">
          <div class="summary-row">
            <span class="label">商品总额：</span>
            <span class="value">¥ {{ Number(cartStore.totalAmount).toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span class="label">应付金额：</span>
            <span class="value">¥ {{ Number(cartStore.totalAmount).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <el-button @click="$router.back()">返回购物车</el-button>
        <el-button type="primary" :loading="submitting" @click="handleSubmit">
          提交订单
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 结算页：展示购物车商品清单和总价，提交订单
 */
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useCartStore } from "@/stores/cart";
import { createOrder } from "@/api/order";
const loading = ref(true);
const submitting = ref(false);
const cartStore = useCartStore();
const router = useRouter();

const placeholderImg =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="#f0f0f0" width="80" height="80"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12">图</text></svg>',
  );

async function loadCart() {
  try {
    await cartStore.fetchCart(1, 9999);
  } finally {
    loading.value = false;
  }
}

async function handleSubmit() {
  if (cartStore.items.length === 0) {
    ElMessage.warning("购物车是空的");
    return;
  }
 ElMessageBox.confirm("确定提交订单吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
        submitting.value = true;
  try {
    const result = await createOrder();
    ElMessage.success("订单提交成功");
    // 清空购物车缓存
    await cartStore.fetchCart(1, 9999);
    // 跳转到订单详情
    router.push(`/orders/${result.orderId}`);
  } catch (e) {
    // 错误已在 request 拦截器提示
  } finally {
    submitting.value = false;
  }
    })
    .catch(() => {});

}

onMounted(() => loadCart());
</script>

<style lang="scss" scoped>
.checkout-view {
  .page-title {
    margin: 0 0 var(--spacing-md);
    font-size: 22px;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: var(--text);
  }
  .empty {
    padding: var(--spacing-lg);
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border);
  }
  .checkout-card {
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    padding: var(--spacing-md);
    border: 1px solid var(--border);
  }

  .section {
    margin-bottom: var(--spacing-md);
    &:last-child {
      margin-bottom: 0;
    }
  }

  .section-title {
    margin: 0 0 var(--spacing-sm);
    font-size: 16px;
    font-weight: 600;
    color: var(--text);
  }

  .order-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: var(--spacing-sm) 0;
    border-bottom: 1px solid var(--border);

    &:last-child {
      border-bottom: none;
    }

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
      margin-bottom: 4px;
    }
    .item-meta {
      font-size: 12px;
      color: var(--text-secondary);
    }
    .item-total {
      font-weight: 600;
      color: var(--primary);
      min-width: 80px;
      text-align: right;
    }
  }

  .summary {
    padding: var(--spacing-sm);
    background: #f9f9f9;
    border-radius: var(--radius-btn);
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;

    .label {
      color: var(--text-secondary);
    }
    .value {
      font-weight: 500;
    }

    &.total {
      border-top: 1px solid var(--border);
      margin-top: 8px;
      padding-top: 16px;
      font-size: 18px;

      .label {
        color: var(--text);
        font-weight: 600;
      }
      .value {
        color: var(--primary);
        font-weight: 600;
      }
    }
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 16px;
    margin-top: var(--spacing-md);
  }
}
</style>
