# 多阶段构建，基础镜像使用官方 node:20-alpine（支持 ARM64 / AMD64）
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

# 运行阶段：仅保留运行时依赖与源码（含 scripts，供启动时 reseed 使用）
FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package.json ./
ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "src/index.js"]
