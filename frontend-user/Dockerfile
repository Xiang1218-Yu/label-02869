# 阶段一：构建 Vue 项目（使用官方 node 镜像，跨平台）
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 阶段二：Nginx 托管静态资源并代理 /api（使用官方 nginx 镜像，跨平台）
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
