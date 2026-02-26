/**
 * Express 应用组装：中间件 + 路由
 */
const express = require('express');
const cors = require('cors');
const requestLog = require('./middleware/requestLog');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
// 确保 JSON 响应使用 UTF-8，解决中文乱码
app.use((req, res, next) => {
  const orig = res.json.bind(res);
  res.json = function (body) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return orig(body);
  };
  next();
});
app.use(requestLog);

app.use('/api', routes);

// 健康检查（便于 Docker / 运维）
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(errorHandler);

module.exports = app;
