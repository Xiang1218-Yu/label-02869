<template>
  <div class="product-card">
    <router-link :to="`/product/${product.id}`" class="cover-wrap">
      <img :src="product.cover_url || placeholderImg" :alt="product.name" class="cover" />
    </router-link>
    <div class="body">
      <router-link :to="`/product/${product.id}`" class="name">{{ product.name }}</router-link>
      <p class="desc">{{ (product.description || '').slice(0, 30) }}{{ (product.description || '').length > 30 ? '…' : '' }}</p>
      <div class="bottom">
        <div class="price-info">
          <span class="price">¥ {{ Number(product.price || 0).toFixed(2) }}</span>
          <span class="unit">/ {{ product.unit || '份' }}</span>
        </div>
        <el-button type="primary" size="small" :loading="adding" @click.prevent="emit('add-cart', product.id)">
          加购
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 商品卡片组件：展示封面、名称、描述、价格，触发加购事件
 * 使用 placeholder 图片避免破损；点击卡片跳转详情
 */
import { ref } from 'vue';
const placeholderImg = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect fill="#f0f0f0" width="200" height="200"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#999" font-size="14">暂无图片</text></svg>');

defineProps({
  product: { type: Object, required: true },
});
const emit = defineEmits(['add-cart']);
const adding = ref(false);
</script>

<style lang="scss" scoped>
.product-card {
  background: var(--card-bg);
  border-radius: var(--radius);
  box-shadow: var(--card-shadow);
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
  transition: box-shadow 0.2s;
  &:hover { box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12); }
  .cover-wrap {
    display: block;
    height: 160px;
    background: #f0f0f0;
  }
  .cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .body {
    padding: var(--spacing-sm);
    .name {
      display: block;
      font-weight: 600;
      color: var(--text);
      text-decoration: none;
      margin-bottom: 4px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .desc { font-size: 12px; color: var(--text-secondary); margin: 0 0 var(--spacing-xs); line-height: 1.4; }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .price-info {
        display: flex;
        align-items: baseline;
        gap: 4px;
      }
      .price { font-size: 16px; font-weight: 600; color: var(--primary); }
      .unit { font-size: 12px; color: var(--text-secondary); }
    }
  }
}
</style>
