/**
 * 请求日志中间件（关键业务：记录请求方法与路径，便于排查）
 * 可扩展为记录 body、耗时等
 */
function requestLog(req, res, next) {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
}

module.exports = requestLog;
