<template>
  <div class="order-list-view">
    <h1 class="page-title">我的订单</h1>

    <el-skeleton v-if="loading" :rows="6" animated />
    <div v-else-if="!userStore.isLoggedIn" class="empty">
      <el-empty description="请先登录">
        <router-link to="/login">
          <el-button type="primary">去登录</el-button>
        </router-link>
      </el-empty>
    </div>
    <div v-else-if="total === 0" class="empty">
      <el-empty description="暂无订单">
        <router-link to="/">
          <el-button type="primary">去逛逛</el-button>
        </router-link>
      </el-empty>
    </div>
    <div v-else class="order-list">
      <div v-for="order in orderList" :key="order.id" class="order-card">
        <div class="order-header">
          <div class="order-info">
            <span class="order-no">订单号：{{ order.id }}</span>
            <span class="order-time">{{ formatTime(order.created_at) }}</span>
          </div>
          <el-tag :type="getStatusType(order.status)">{{ getStatusText(order.status) }}</el-tag>
        </div>
        <div class="order-body">
          <div class="order-amount">
            <span class="label">订单金额：</span>
            <span class="value">¥ {{ Number(order.total_amount).toFixed(2) }}</span>
          </div>
          <div class="order-actions">
            <el-button type="primary" link @click="$router.push(`/orders/${order.id}`)">
              查看详情
            </el-button>
            <el-button 
              v-if="order.status === 'pending'" 
              type="primary" 
              @click="handlePayOrder(order.id)"
            >
              立即支付
            </el-button>
          </div>
        </div>
      </div>

      <el-pagination
        v-if="total > 0"
        class="pagination"
        v-model:current-page="page"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20]"
        :total="total"
        layout="total, sizes, prev, pager, next"
        @current-change="onPageChange"
        @size-change="onSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
/**
 * 订单列表页：展示用户的所有订单，支持支付
 */
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getOrderList, payOrder } from "@/api/order";
import { useUserStore } from "@/stores/user";

const loading = ref(true);
const orderList = ref([]);
const page = ref(1);
const pageSize = ref(10);
const total = ref(0);
const userStore = useUserStore();
const router = useRouter();

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

async function loadOrders() {
  if (!userStore.isLoggedIn) {
    loading.value = false;
    return;
  }

  loading.value = true;
  try {
    const res = await getOrderList({ page: page.value, pageSize: pageSize.value });
    orderList.value = res.list || [];
    total.value = res.total || 0;
  } finally {
    loading.value = false;
  }
}

function onPageChange(p) {
  page.value = p;
  loadOrders();
}

function onSizeChange(size) {
  pageSize.value = size;
  page.value = 1;
  loadOrders();
}

async function handlePayOrder(orderId) {
  router.push(`/orders/${orderId}`);
}

onMounted(() => loadOrders());
</script>

<style lang="scss" scoped>
.order-list-view {
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

  .order-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .order-card {
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    padding: var(--spacing-md);
    border: 1px solid var(--border);
  }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: var(--spacing-xs);
    border-bottom: 1px solid var(--border);
    margin-bottom: var(--spacing-xs);
  }

  .order-info {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .order-no {
      font-weight: 600;
    }
    .order-time {
      font-size: 12px;
      color: var(--text-secondary);
    }
  }

  .order-body {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .order-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .order-amount {
    .label {
      color: var(--text-secondary);
      margin-right: 8px;
    }
    .value {
      font-size: 18px;
      font-weight: 600;
      color: var(--primary);
    }
  }

  .pagination {
    margin-top: var(--spacing-md);
    justify-content: center;
  }
}
</style>
