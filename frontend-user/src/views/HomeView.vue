<template>
  <div class="home-view">
    <h1 class="page-title">
      新鲜水果

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
    </h1>

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
  .page-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 0 var(--spacing-md);
    font-size: 20px;
    font-weight: 600;
    color: var(--text);
  }
  .search-bar {
    display: inline-block;
    .search-input {
      width: 30vw;
    }
  }
  .product-grid {
    margin-bottom: var(--spacing-md);
  }
  .empty-tip {
    text-align: center;
    padding: var(--spacing-md);
    color: var(--text-secondary);
  }
  .pagination {
    margin-top: var(--spacing-md);
    justify-content: center;
  }
}
</style>
