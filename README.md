# 水果店

Vue 3 用户端 + Node.js 后端的全栈示例：首页商品列表、商品详情、购物车、登录/注册、订单管理。后端提供 REST API（JWT 认证），前端使用 Element Plus，风格简约。

---

# How to Run

## 使用 Docker（推荐）

在项目根目录执行：

```bash
# 启动所有服务
docker-compose up --build -d

# 重启后端服务（应用数据库更改）
docker-compose restart backend

# 查看日志
docker-compose logs -f backend
```

- 前端（用户端）：<http://localhost:8081>
- 后端 API：<http://localhost:3000>
- MySQL：端口 3306（root/root，库 fruit_shop，用户 app/app123）

首次启动后，后端会自动创建测试账号和订单表，见下方「测试账号」。

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

# 使用流程

1. 访问 <http://localhost:8081>
2. 使用测试账号登录（demo / 123456）
3. 浏览首页商品列表，点击商品查看详情
4. 添加商品到购物车（导航栏会显示数量角标）
5. 进入购物车页面，调整商品数量
6. 点击"去结算"进入结算页面
7. 确认订单信息后提交订单
8. 查看订单详情或返回继续购物
9. 在"我的订单"页面查看所有订单

---

# API 接口

## 认证相关
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/register` - 用户注册
- `GET /api/auth/me` - 获取当前用户信息

## 商品相关
- `GET /api/products` - 获取商品列表（支持分页和搜索）
- `GET /api/products/:id` - 获取商品详情

## 购物车相关
- `GET /api/cart` - 获取购物车列表
- `POST /api/cart` - 添加商品到购物车
- `PUT /api/cart/:productId` - 更新购物车商品数量
- `DELETE /api/cart/:productId` - 删除购物车商品

## 订单相关（新增）
- `POST /api/orders` - 创建订单（从购物车）
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情

---

# 题目内容

我想写一个水果店的vue.js开发，要求有首页，商品详情页面，购物车页面，登录页面（要能登录），要僭越大方，还要注释实现使用的相对应的方法


## 项目结构

### 后端 (backend/)
```
backend/
├── scripts/
│   ├── reseed-products.js  # 重新生成商品数据
│   └── seed.js             # 创建演示用户
├── src/
│   ├── config/
│   ├── controllers/
│   │   ├── AuthController.js     # 认证相关
│   │   ├── CartController.js     # 购物车相关
│   │   ├── OrderController.js    # 订单相关（新增）
│   │   └── ProductController.js  # 商品相关
│   ├── middleware/
│   │   ├── auth.js          # JWT认证
│   │   ├── errorHandler.js  # 错误处理
│   │   └── requestLog.js    # 请求日志
│   ├── models/
│   │   ├── CartModel.js     # 购物车模型
│   │   ├── OrderModel.js    # 订单模型（新增）
│   │   ├── ProductModel.js  # 商品模型
│   │   └── UserModel.js     # 用户模型
│   ├── routes/
│   ├── services/
│   │   ├── AuthService.js     # 认证服务
│   │   ├── CartService.js     # 购物车服务
│   │   ├── OrderService.js    # 订单服务（新增）
│   │   └── ProductService.js  # 商品服务
│   ├── app.js          # 应用配置
│   ├── db.js           # 数据库连接
│   ├── index.js        # 入口文件
│   └── initSeed.js     # 初始化种子数据
├── .env.example  # 环境变量示例
├── Dockerfile    # Docker配置
├── package.json  # 依赖管理
└── schema.sql    # 数据库建表脚本（包含订单表）
```

### 前端 (frontend-user/)
```
frontend-user/
├── public/           # 静态资源
├── src/
│   ├── api/
│   │   ├── auth.js     # 认证相关API
│   │   ├── cart.js     # 购物车相关API
│   │   ├── order.js    # 订单相关API（新增）
│   │   ├── product.js  # 商品相关API
│   │   └── request.js  # 请求封装
│   ├── components/
│   │   └── ProductCard.vue  # 商品卡片组件
│   ├── images/        # 图片资源
│   ├── router/         # 路由配置
│   ├── stores/
│   │   ├── cart.js  # 购物车状态
│   │   └── user.js  # 用户状态
│   ├── styles/
│   │   └── global.scss  # 全局样式
│   ├── utils/
│   │   └── crypto.js  # 加密工具
│   ├── views/
│   │   ├── CartView.vue          # 购物车页面
│   │   ├── CheckoutView.vue      # 结算页面（新增）
│   │   ├── HomeView.vue          # 首页
│   │   ├── LoginView.vue         # 登录页面
│   │   ├── OrderDetailView.vue   # 订单详情页面（新增）
│   │   ├── OrderListView.vue     # 订单列表页面（新增）
│   │   └── ProductDetailView.vue  # 商品详情页面
│   ├── App.vue        # 根组件
│   └── main.js        # 入口文件
├── Dockerfile       # Docker配置
├── index.html       # HTML模板
├── nginx.conf       # Nginx配置
├── package.json     # 依赖管理
└── vite.config.js   # Vite配置
```

## 功能介绍

### 前端功能
1. **首页**：展示商品列表，包含商品图片、名称、价格、单位等信息
2. **商品详情页面**：展示商品详细信息，支持添加到购物车
3. **购物车页面**：查看已添加的商品，支持修改数量、删除商品、结算
4. **结算页面**：确认订单信息，提交订单
5. **订单列表页面**：查看所有历史订单
6. **订单详情页面**：查看订单的商品清单和金额
7. **登录/注册页面**：用户登录、注册功能，支持表单验证
8. **用户状态管理**：使用Pinia管理用户登录状态
9. **购物车状态管理**：使用Pinia管理购物车商品和数量角标

### 后端功能
1. **认证系统**：基于JWT的用户认证，支持登录、注册
2. **商品管理**：提供商品列表、商品详情API
3. **购物车管理**：提供添加、修改、删除购物车商品API
4. **订单管理**：提供创建订单、查询订单列表和详情API
5. **数据库操作**：使用MySQL存储数据，包含用户、商品、购物车、订单表
6. **错误处理**：统一的错误处理机制
7. **请求日志**：记录API请求日志

### 技术栈
- **前端**：Vue 3 + Vite + Element Plus + Pinia + SCSS
- **后端**：Node.js + Express + MySQL + JWT
- **部署**：Docker + Docker Compose

### 数据库表结构
- `user` - 用户表
- `product` - 商品表
- `cart_item` - 购物车项表
- `order` - 订单表
- `order_item` - 订单项表