/**
 * 种子脚本：创建测试账号 demo / 123456
 * 与前端约定：客户端发送 SHA-256(密码)，此处存储 bcrypt(SHA256('123456'))
 */
require('dotenv').config();
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

function sha256Hex(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

async function main() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'fruit_shop',
  });
  const clientPassword = sha256Hex('123456');
  const hash = bcrypt.hashSync(clientPassword, 10);
  await conn.execute(
    'INSERT INTO `user` (`username`, `password_hash`, `nickname`) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE `password_hash` = ?, `nickname` = ?',
    ['demo', hash, '演示用户', hash, '演示用户']
  );
  console.log('Seed OK: 测试账号 demo / 123456');
  await conn.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
