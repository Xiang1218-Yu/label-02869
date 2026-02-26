# 水果店

Vue 3 用户端 + Node.js 后端的全栈示例：首页商品列表、商品详情、购物车、登录/注册。后端提供 REST API（JWT 认证），前端使用 Element Plus，风格简约。

---

# How to Run

## 使用 Docker（推荐）

在项目根目录执行：

```bash
docker-compose up --build -d
```

- 前端（用户端）：<http://localhost:8081>
- 后端 API：<http://localhost:3000>
- MySQL：端口 3306（root/root，库 fruit_shop，用户 app/app123）

首次启动后，后端会自动创建测试账号，见下方「测试账号」。

## 本地开发

1. **数据库**：MySQL 8.0 已安装并运行。执行建表：

   ```bash
   mysql -u root -p < backend/schema.sql
   ```

2. **后端**：

   ```bash
   cd backend
   cp .env.example .env   # 按需修改 DB_*、JWT_SECRET
   npm install
   node scripts/seed.js   # 可选：创建 demo 用户
   npm run dev
   ```

3. **前端**：

   ```bash
   cd frontend-user
   npm install
   npm run dev
   ```

   浏览器访问 <http://localhost:5173>，开发环境会代理 `/api` 到后端 3000 端口。

---

# Services

| 服务           | 说明           | 端口  |
|----------------|----------------|-------|
| frontend-user  | 用户端 Vue 前端 | 8081  |
| backend        | Node.js API    | 3000  |
| mysql          | MySQL 8.0      | 3306  |

---

# 测试账号

- 用户名：`demo`  
- 密码：`123456`  

（首次 Docker 启动或执行 `backend/scripts/seed.js` 后自动创建；亦可注册新账号。）

---

# 题目内容

这是一个全栈项目，后端语言使用最快最简单的即可：  
我想写一个水果店的 vue.js 开发，要求有首页，商品详情页面，购物车页面，登录页面（要能登录），要简约大方，还要注释实现使用的相对应的方法。
