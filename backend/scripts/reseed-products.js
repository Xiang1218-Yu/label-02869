/**
 * 用 Node 以 UTF-8 重新插入商品数据，解决因初始化时字符集错误导致的中文乱码。
 * 使用方式：在 backend 目录执行 node scripts/reseed-products.js（需先配置 .env）
 */
require('dotenv').config();
const mysql = require('mysql2/promise');

const products = [
  {
    name: '新鲜苹果',
    cover_url: 'https://copyright.bdstatic.com/vcg/creative/9904f90bae365cbabf0e3422ae79d141c1d437ab.jpg@wm_1,k_cGljX2JqaHdhdGVyLmpwZw==',
    description: '产自陕西、山东等优质产区，果皮红润或青脆，果肉脆甜多汁，富含膳食纤维与维生素 C。适合直接鲜食或榨汁，冷藏后口感更佳。',
    price: 12.80,
    stock: 100,
    unit: '斤',
  },
  {
    name: '进口橙子',
    cover_url: 'https://inews.gtimg.com/news_bt/OI0ANxJ0BVJle2rsxDXxauF02OxHq3AXKmdzNzaRzWKSUAA/641',
    description: '精选进口脐橙，酸甜适中，维 C 丰富，果肉饱满无渣。适合补充每日维生素、增强免疫力，亦可榨汁或做果盘。',
    price: 9.90,
    stock: 80,
    unit: '斤',
  },
  {
    name: '海南香蕉',
    cover_url: 'https://img2.baidu.com/it/u=3733023367,2730633383&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=749g',
    description: '海南直供香蕉，自然熟成，软糯香甜，富含钾元素。可直接食用或搭配燕麦、酸奶，是早餐与加餐的理想选择。',
    price: 6.50,
    stock: 120,
    unit: '斤',
  },
  {
    name: '新疆葡萄',
    cover_url: 'https://inews.gtimg.com/om_bt/O-Ul5CKLwIKZcvqvKC04iCq0V5IhMwvI0SLVlAM2Ad8OwAA/1000',
    description: '新疆无籽葡萄，颗颗饱满、甜度高、皮薄多汁。适合鲜食或制成果汁，冷藏后风味更佳。',
    price: 18.00,
    stock: 60,
    unit: '斤',
  },
  {
    name: '泰国榴莲',
    cover_url: 'https://img0.baidu.com/it/u=66075833,3460728373&fm=253&fmt=auto&app=138&f=JPEG?w=333&h=500',
    description: '泰国金枕榴莲，果肉饱满、香味浓郁、口感绵密。开壳即食或冷冻后口感似冰淇淋，是榴莲爱好者的首选。',
    price: 88.00,
    stock: 30,
    unit: '个',
  },
];

/**
 * 执行商品重插（UTF-8），可被 index 启动时或命令行调用
 */
async function runReseedProducts() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fruit_shop',
    charset: 'utf8mb4',
  });
  await conn.execute("SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci'");
  await conn.execute('DELETE FROM cart_item');
  await conn.execute('DELETE FROM product');
  for (const p of products) {
    await conn.execute(
      'INSERT INTO `product` (`name`, `cover_url`, `description`, `price`, `stock`, `unit`) VALUES (?, ?, ?, ?, ?, ?)',
      [p.name, p.cover_url, p.description, p.price, p.stock, p.unit]
    );
  }
  await conn.end();
  return products.length;
}

if (require.main === module) {
  require('dotenv').config();
  runReseedProducts()
    .then((n) => {
      console.log('Reseed OK: 已重新插入', n, '个商品（UTF-8）');
    })
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

module.exports = { runReseedProducts, products };
