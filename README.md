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


## 项目结构

```
├── backend/                # 后端服务
│   ├── scripts/            # 数据库种子脚本
│   │   ├── reseed-products.js  # 重新生成商品数据
│   │   └── seed.js              # 创建演示用户
│   ├── src/                # 后端源码
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   │   ├── AuthController.js    # 认证相关
│   │   │   ├── CartController.js    # 购物车相关
│   │   │   └── ProductController.js # 商品相关
│   │   ├── middleware/     # 中间件
│   │   │   ├── auth.js             # JWT认证
│   │   │   ├── errorHandler.js     # 错误处理
│   │   │   └── requestLog.js       # 请求日志
│   │   ├── models/         # 数据模型
│   │   │   ├── CartModel.js        # 购物车模型
│   │   │   ├── ProductModel.js     # 商品模型
│   │   │   └── UserModel.js        # 用户模型
│   │   ├── routes/         # 路由
│   │   ├── services/       # 业务逻辑
│   │   │   ├── AuthService.js      # 认证服务
│   │   │   ├── CartService.js      # 购物车服务
│   │   │   └── ProductService.js   # 商品服务
│   │   ├── app.js          # 应用配置
│   │   ├── db.js           # 数据库连接
│   │   ├── index.js        # 入口文件
│   │   └── initSeed.js     # 初始化种子数据
│   ├── .env.example        # 环境变量示例
│   ├── Dockerfile          # Docker配置
│   ├── package.json        # 依赖管理
│   └── schema.sql          # 数据库建表脚本
├── frontend-user/          # 前端用户端
│   ├── public/             # 静态资源
│   ├── src/                # 前端源码
│   │   ├── api/            # API调用
│   │   │   ├── auth.js             # 认证相关API
│   │   │   ├── cart.js             # 购物车相关API
│   │   │   ├── product.js          # 商品相关API
│   │   │   └── request.js          # 请求封装
│   │   ├── components/     # 组件
│   │   │   └── ProductCard.vue     # 商品卡片组件
│   │   ├── images/         # 图片资源
│   │   ├── router/         # 路由配置
│   │   ├── stores/         # 状态管理
│   │   │   ├── cart.js             # 购物车状态
│   │   │   └── user.js             # 用户状态
│   │   ├── styles/         # 样式
│   │   │   └── global.scss         # 全局样式
│   │   ├── utils/          # 工具函数
│   │   │   └── crypto.js           # 加密工具
│   │   ├── views/          # 页面
│   │   │   ├── CartView.vue        # 购物车页面
│   │   │   ├── HomeView.vue        # 首页
│   │   │   ├── LoginView.vue       # 登录页面
│   │   │   └── ProductDetailView.vue # 商品详情页面
│   │   ├── App.vue         # 根组件
│   │   └── main.js         # 入口文件
│   ├── Dockerfile          # Docker配置
│   ├── index.html          # HTML模板
│   ├── nginx.conf          # Nginx配置
│   ├── package.json        # 依赖管理
│   └── vite.config.js      # Vite配置
├── docs/                   # 文档
│   └── project_design.md   # 项目设计文档
├── .gitignore              # Git忽略文件
├── README.md               # 项目说明
└── docker-compose.yml      # Docker Compose配置
```

## 功能介绍

### 前端功能
1. **首页**：展示商品列表，包含商品图片、名称、价格等信息
2. **商品详情页面**：展示商品详细信息，支持添加到购物车
3. **购物车页面**：查看已添加的商品，支持修改数量、删除商品、结算
4. **登录/注册页面**：用户登录、注册功能，支持表单验证
5. **用户状态管理**：使用Pinia管理用户登录状态
6. **购物车状态管理**：使用Pinia管理购物车商品

### 后端功能
1. **认证系统**：基于JWT的用户认证，支持登录、注册
2. **商品管理**：提供商品列表、商品详情API
3. **购物车管理**：提供添加、修改、删除购物车商品API
4. **数据库操作**：使用MySQL存储数据，包含用户、商品、购物车表
5. **错误处理**：统一的错误处理机制
6. **请求日志**：记录API请求日志

### 技术栈
- **前端**：Vue 3 + Vite + Element Plus + Pinia + SCSS
- **后端**：Node.js + Express + MySQL + JWT
- **部署**：Docker + Docker Compose