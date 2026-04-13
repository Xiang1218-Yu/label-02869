<template>
  <div class="order-detail-view">
    <h1 class="page-title">订单详情</h1>

    <el-skeleton v-if="loading" :rows="6" animated />
    <div v-else-if="!order" class="empty">
      <el-empty description="订单不存在">
        <router-link to="/orders">
          <el-button type="primary">查看我的订单</el-button>
        </router-link>
      </el-empty>
    </div>
    <div v-else class="order-card">
      <div class="section">
        <div class="order-header">
          <div class="order-info">
            <div class="order-no">订单号：{{ order.id }}</div>
            <div class="order-time">下单时间：{{ formatTime(order.created_at) }}</div>
          </div>
          <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">商品清单</h3>
        <div v-for="item in order.items" :key="item.id" class="order-item">
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
          <div class="summary-row total">
            <span class="label">订单总额：</span>
            <span class="value">¥ {{ Number(order.total_amount).toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <div class="actions">
        <el-button @click="$router.push('/orders')">返回订单列表</el-button>
        <el-button 
          v-if="order.status === 'pending'" 
          type="primary" 
          :loading="paying"
          @click="handlePay"
        >
          立即支付
        </el-button>
        <el-button v-else type="primary" @click="$router.push('/')">继续购物</el-button>
        <el-button type="success" @click="handleReorder" :loading="reordering">再来一单</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 订单详情页：展示订单信息和商品清单，支持支付
 */
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { getOrderDetail, payOrder } from "@/api/order";
import { useCartStore } from "@/stores/cart";

const route = useRoute();
const router = useRouter();
const loading = ref(true);
const paying = ref(false);
const reordering = ref(false);
const order = ref(null);
const cartStore = useCartStore();

const placeholderImg =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect fill="#f0f0f0" width="80" height="80"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="12">图</text></svg>',
  );

function getStatusText(status) {
  const map = {
    pending: "待支付",
    paid: "已支付",
    cancelled: "已取消",
  };
  return map[status] || status;
}

function getStatusType(status) {
  const map = {
    pending: "warning",
    paid: "success",
    cancelled: "info",
  };
  return map[status] || "";
}

function formatTime(time) {
  if (!time) return "";
  const date = new Date(time);
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function loadOrder() {
  const orderId = route.params.id;
  if (!orderId) {
    loading.value = false;
    return;
  }

  try {
    order.value = await getOrderDetail(orderId);
  } catch (e) {
    // 错误已在 request 拦截器提示
  } finally {
    loading.value = false;
  }
}

async function handlePay() {
  ElMessageBox.confirm(
    `确认支付 ¥${Number(order.value.total_amount).toFixed(2)} 吗？`,
    "模拟支付",
    {
      confirmButtonText: "确认支付",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      paying.value = true;
      try {
        // 模拟支付延迟
        await new Promise((resolve) => setTimeout(resolve, 1500));
        await payOrder(order.value.id);
        ElMessage.success("支付成功！");
        // 重新加载订单详情
        await loadOrder();
      } catch (e) {
        // 错误已在 request 拦截器提示
      } finally {
        paying.value = false;
      }
    })
    .catch(() => {});
}

/**
 * 再来一单：将订单中所有商品添加到购物车并跳转到结算页
 */
async function handleReorder() {
  if (!order.value?.items?.length) {
    ElMessage.warning("没有可复制的商品信息");
    return;
  }

  ElMessageBox.confirm(
    "确定将该订单的商品添加到购物车吗？",
    "再来一单",
    {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning",
    }
  )
    .then(async () => {
      reordering.value = true;
      try {
        // 逐个添加商品到购物车
        for (const item of order.value.items) {
          await cartStore.add(item.product_id, item.quantity);
        }
        ElMessage.success("商品已添加到购物车");
        // 跳转到结算页面
        router.push("/checkout");
      } catch (e) {
        // 错误已在 request 拦截器提示
      } finally {
        reordering.value = false;
      }
    })
    .catch(() => {});
}

onMounted(() => loadOrder());
</script>

<style lang="scss" scoped>
.order-detail-view {
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
  .order-card {
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

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: var(--spacing-sm);
    background: #f9f9f9;
    border-radius: var(--radius-btn);
  }

  .order-info {
    .order-no {
      font-weight: 600;
      margin-bottom: 4px;
    }
    .order-time {
      font-size: 12px;
      color: var(--text-secondary);
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

    &.total {
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
