/**
 * 后端入口：加载配置、初始化测试账号、校正商品 UTF-8（防乱码）、启动 HTTP 服务
 */
const app = require('./app');
const config = require('./config');
const initSeed = require('./initSeed');
const { runReseedProducts } = require('../scripts/reseed-products');

async function start() {
  try {
    await initSeed();
  } catch (e) {
    console.warn('[startup] initSeed 跳过:', e.message);
  }
  try {
    const n = await runReseedProducts();
    console.log('[startup] 商品已校正 UTF-8，共', n, '条');
  } catch (e) {
    console.warn('[startup] 商品 reseed 跳过:', e.message);
  }
  app.listen(config.port, () => {
    console.log(`Fruit Shop API listening on http://localhost:${config.port}`);
  });
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
