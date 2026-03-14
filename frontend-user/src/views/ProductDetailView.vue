<template>
  <div class="product-detail-view">
    <div class="detail-toolbar">
      <el-button type="primary" link class="back-btn" @click="goBack">
        ← 返回
      </el-button>
    </div>
    <el-skeleton v-if="loading" :rows="5" animated />
    <div v-else-if="product" class="detail-card">
      <div class="cover-wrap">
        <img :src="product.cover_url || placeholderImg" :alt="product.name" class="cover" />
      </div>
      <div class="info">
        <h1 class="name">{{ product.name }}</h1>
        <div class="price-row">
          <span class="price">¥ {{ Number(product.price || 0).toFixed(2) }}</span>
          <span class="unit">/ {{ product.unit || '份' }}</span>
        </div>
        <div class="meta-row">
          <span class="stock">库存 {{ product.stock }} {{ product.unit || '份' }}</span>
        </div>
        <div class="actions">
          <el-input-number v-model="quantity" :min="1" :max="product.stock" :step="1" size="large" />
          <el-button type="primary" size="large" :loading="adding" @click="handleAddCart">
            加入购物车
          </el-button>
        </div>
        <div class="desc-block">
          <h3 class="desc-title">商品介绍</h3>
          <p class="desc">{{ product.description || '暂无描述' }}</p>
        </div>
        <div class="extra-block">
          <h4 class="extra-title">配送与说明</h4>
          <p class="extra-text">· 新鲜直供，品质保证</p>
          <p class="extra-text">· 支持配送与自提（以实际为准）</p>
        </div>
        <div class="service-block">
          <h4 class="service-title">服务与保障</h4>
          <div class="service-list">
            <span class="service-item">退换无忧</span>
            <span class="service-item">破损包赔</span>
            <span class="service-item">准时达</span>
          </div>
        </div>
      </div>
    </div>
    <el-empty v-else description="商品不存在" />
  </div>
</template>

<script setup>
/**
 * 商品详情页：根据路由 id 拉取 getProductById，支持数量选择与加入购物车
 */
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import { getProductById } from '@/api/product';
import { useCartStore } from '@/stores/cart';
import { useUserStore } from '@/stores/user';
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const product = ref(null);
const quantity = ref(1);
const adding = ref(false);

const cartStore = useCartStore();
const userStore = useUserStore();

const placeholderImg = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="14">暂无图片</text></svg>');

async function loadDetail() {
  const id = Number(route.params.id);
  if (!id) return;
  loading.value = true;
  try {
    product.value = await getProductById(id);
    quantity.value = 1;
  } catch (e) {
    product.value = null;
  } finally {
    loading.value = false;
  }
}

async function handleAddCart() {
  if (!userStore.isLoggedIn) {
    ElMessage.warning('请先登录');
    router.push('/login');
    return;
  }
  if (!product.value) return;
  adding.value = true;
  try {
    await cartStore.add(product.value.id, quantity.value);
    ElMessage.success('已加入购物车');
  } finally {
    adding.value = false;
  }
}

function goBack() {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}

onMounted(() => loadDetail());
</script>

<style lang="scss" scoped>
.product-detail-view {
  max-width: 900px;
  margin: 0 auto;
  padding-bottom: var(--spacing-md);

  .detail-toolbar {
    margin-bottom: var(--spacing-sm);
    .back-btn {
      color: var(--primary);
      padding-left: 0;
      font-size: 14px;
    }
  }

  .detail-card {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    flex-wrap: wrap;
  }

  .cover-wrap {
    width: 320px;
    min-width: 280px;
    flex-shrink: 0;
    aspect-ratio: 1;
    border-radius: var(--radius);
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    .cover {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      vertical-align: top;
    }
  }

  .info {
    flex: 1;
    min-width: 280px;
    padding: 0 var(--spacing-xs);

    .name {
      margin: 0 0 var(--spacing-sm);
      font-size: 22px;
      font-weight: 600;
      color: var(--text);
      line-height: 1.3;
    }
    .price-row {
      margin-bottom: var(--spacing-sm);
      padding-bottom: var(--spacing-sm);
      border-bottom: 1px dashed var(--border);
    }
    .price {
      font-size: 28px;
      color: var(--primary);
      font-weight: 600;
    }
    .unit {
      font-size: 14px;
      color: var(--text-secondary);
      margin-left: 6px;
    }
    .meta-row {
      margin-bottom: var(--spacing-sm);
      font-size: 14px;
      color: var(--text-secondary);
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: var(--spacing-md);
    }
    .desc-block {
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm) 0;
      border-top: 1px solid var(--border);
      .desc-title {
        margin: 0 0 var(--spacing-xs);
        font-size: 16px;
        font-weight: 600;
        color: var(--text);
      }
      .desc {
        color: var(--text-secondary);
        margin: 0;
        line-height: 1.8;
        white-space: pre-line;
        font-size: 14px;
      }
    }
    .extra-block {
      margin-top: var(--spacing-md);
      padding: var(--spacing-sm) var(--spacing-sm);
      background: var(--page-bg);
      border-radius: var(--radius-btn);
      border: 1px solid var(--border);
      .extra-title {
        margin: 0 0 var(--spacing-xs);
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
      }
      .extra-text {
        margin: 4px 0;
        font-size: 13px;
        color: var(--text-secondary);
      }
    }
    .service-block {
      margin-top: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-sm);
      background: linear-gradient(135deg, rgba(46, 125, 50, 0.06) 0%, rgba(76, 175, 80, 0.04) 100%);
      border-radius: var(--radius-btn);
      border: 1px solid rgba(46, 125, 50, 0.15);
      .service-title {
        margin: 0 0 var(--spacing-xs);
        font-size: 14px;
        font-weight: 600;
        color: var(--text);
      }
      .service-list {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
      }
      .service-item {
        font-size: 13px;
        color: var(--text-secondary);
        padding: 4px 10px;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 6px;
      }
    }
  }
}
</style>
