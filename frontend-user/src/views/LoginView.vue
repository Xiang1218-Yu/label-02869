<template>
  <div class="login-view">
    <div class="login-card">
      <h1 class="title">登录</h1>
      <el-tabs v-model="tab" class="tabs">
        <el-tab-pane label="登录" name="login">
          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            label-width="0"
            @submit.prevent="handleLogin"
          >
            <el-form-item prop="username">
              <el-input
                v-model="loginForm.username"
                placeholder="用户名"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="密码"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                native-type="submit"
                class="submit-btn"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="注册" name="register">
          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            label-width="0"
            @submit.prevent="handleRegister"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="用户名"
                size="large"
              />
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="密码"
                size="large"
                show-password
              />
            </el-form-item>
            <el-form-item prop="nickname">
              <el-input
                v-model="registerForm.nickname"
                placeholder="昵称（选填）"
                size="large"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                size="large"
                :loading="loading"
                native-type="submit"
                class="submit-btn"
              >
                注册
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div class="footer">
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录页：登录 / 注册 Tab，密码先 SHA-256 再发送，使用 useUserStore.login / register
 * 表单校验：用户名、密码必填
 */
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/user";
import { sha256Hex } from "@/utils/crypto";

const router = useRouter();
const userStore = useUserStore();
const tab = ref("login");
const loading = ref(false);
const loginFormRef = ref(null);
const registerFormRef = ref(null);

const loginForm = reactive({ username: "", password: "" });
const loginRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

const registerForm = reactive({ username: "", password: "", nickname: "" });
const registerRules = {
  username: [{ required: true, message: "请输入用户名", trigger: "blur" }],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};

async function handleLogin() {
  const flag = await loginFormRef.value?.validate().catch(() => {});
  if (!flag) return;
  loading.value = true;
  try {
    const passwordHash = await sha256Hex(loginForm.password);
    await userStore.login({ username: loginForm.username, password: passwordHash });
    ElMessage.success("登录成功");
    const redirect = router.currentRoute.value.query.redirect;
    router.push(redirect && redirect !== '/login' ? redirect : '/');
  } catch (e) {
    // 错误已在 request 中提示
    console.log("登录失败:", e)
  } finally {
    loading.value = false;
  }
}

async function handleRegister() {
  const flag = await registerFormRef.value?.validate().catch(() => {});
  if (!flag) return;
  loading.value = true;
  try {
    const passwordHash = await sha256Hex(registerForm.password);
    await userStore.register({
      username: registerForm.username,
      password: passwordHash,
      nickname: registerForm.nickname,
    });
    ElMessage.success("注册成功");
    const redirect = router.currentRoute.value.query.redirect;
    router.push(redirect && redirect !== '/login' ? redirect : '/');
  } catch (e) {
    // 错误已在 request 中提示
  } finally {
    loading.value = false;
  }
}
</script>

<style lang="scss" scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  .login-card {
    width: 100%;
    max-width: 420px;
    padding: var(--spacing-lg);
    background: var(--card-bg);
    border-radius: var(--radius);
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border);
    .title {
      margin: 0 0 var(--spacing-md);
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-align: center;
      color: var(--text);
    }
    .tabs {
      margin-bottom: var(--spacing-sm);
    }
    .submit-btn {
      width: 100%;
      margin-top: var(--spacing-xs);
    }
    .footer {
      text-align: center;
      margin-top: var(--spacing-md);
      padding-top: var(--spacing-sm);
      border-top: 1px solid var(--border);
    }
    .footer a {
      color: var(--primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
    }
    .footer a:hover { text-decoration: underline; }
  }
}
</style>
