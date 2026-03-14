<template>
  <div class="home-view">
    <div class="page-header">
      <div class="header-left">
        <h1 class="page-title">新鲜水果</h1>
        <p class="page-subtitle">每日直供 · 新鲜到家</p>
      </div>
      <div class="search-bar">
        <el-input
          v-model="keyword"
          placeholder="搜索商品名称或描述"
          clearable
          class="search-input"
          @keyup.enter="onSearch"
          @clear="onSearch('')"
        >
          <template #append>
            <el-button @click="onSearch">搜索</el-button>
          </template>
        </el-input>
      </div>
    </div>

    <div class="trust-strip">
      <span class="trust-item">✓ 产地直采</span>
      <span class="trust-item">✓ 品质保证</span>
      <span class="trust-item">✓ 售后无忧</span>
    </div>

    <el-skeleton v-if="loading" :rows="6" animated />
    <el-row v-else :gutter="24" class="product-grid">
      <el-col
        v-for="item in productList"
        :key="item.id"
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
      >
        <ProductCard :product="item" @add-cart="onAddCart" />
      </el-col>
    </el-row>
    <div v-if="!loading && productList.length === 0" class="empty-tip">
      <img src="@/images/empty.png" alt="暂无商品" class="empty-img" />
      <p class="empty-text">暂无商品</p>
    </div>
    <el-pagination
      v-if="total > 0"
      class="pagination"
      :current-page="page"
      :page-size="pageSize"
      :page-sizes="[8, 12, 24]"
      :total="total"
      layout="total, sizes, prev, pager, next"
      @current-change="onPageChange"
      @size-change="onSizeChange"
    />
  </div>
</template>

<script setup>
/**
 * 首页：商品列表（分页）
 * 使用 getProductList API 拉取数据，ProductCard 展示单商品并支持加入购物车
 */
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { getProductList } from "@/api/product";
import { useCartStore } from "@/stores/cart";
import { useUserStore } from "@/stores/user";
import ProductCard from "@/components/ProductCard.vue";

const loading = ref(true);
const productList = ref([]);
const page = ref(1);
const pageSize = ref(12);
const total = ref(0);
const keyword = ref("");

const router = useRouter();

const cartStore = useCartStore();
const userStore = useUserStore();

async function loadList() {
  loading.value = true;
  try {
    const params = { page: page.value, pageSize: pageSize.value };
    if (keyword.value.trim()) params.keyword = keyword.value.trim();
    const res = await getProductList(params);
    productList.value = res.list || [];
    total.value = res.total || 0;
  } finally {
    loading.value = false;
  }
}

function onSearch() {
  page.value = 1;
  loadList();
}

function onPageChange(p) {
  page.value = p;
  loadList();
}

function onSizeChange(size) {
  pageSize.value = size;
  page.value = 1;
  loadList();
}

async function onAddCart(productId, quantity = 1) {
  if (!userStore.isLoggedIn) {
    ElMessage.warning("请先登录");
    router.push("/login");
    return;
  }
  try {
    await cartStore.add(productId, quantity);
    ElMessage.success("已加入购物车");
  } catch (e) {
    // 错误已在 request 拦截器提示
  }
}

onMounted(() => loadList());
</script>

<style lang="scss" scoped>
.home-view {
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
  .header-left {
    .page-title {
      margin: 0 0 4px;
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: var(--text);
    }
    .page-subtitle {
      margin: 0;
      font-size: 14px;
      color: var(--text-secondary);
    }
  }
  .search-bar .search-input {
    width: min(320px, 100%);
  }
  .trust-strip {
    display: flex;
    gap: var(--spacing-md);
    padding: var(--spacing-sm) 0;
    margin-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border);
    font-size: 13px;
    color: var(--text-secondary);
  }
  .trust-item { white-space: nowrap; }
  .product-grid {
    margin-bottom: var(--spacing-md);
  }
  .empty-tip {
    text-align: center;
    padding: var(--spacing-lg);
    color: var(--text-secondary);
  }
  .empty-img { max-width: 200px; opacity: 0.8; }
  .pagination {
    margin-top: var(--spacing-md);
    justify-content: center;
  }
}
</style>
