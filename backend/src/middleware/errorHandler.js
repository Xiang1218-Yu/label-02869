/**
 * 全局异常处理中间件
 * 捕获所有 next(err)，返回统一 JSON 格式并记录日志
 */
function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message = err.message || '服务器内部错误';
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.url}`, err);
  res.status(status).json({ code: status, message });
}

module.exports = errorHandler;
