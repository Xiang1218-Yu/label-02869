/**
 * 启动时执行一次：若不存在 demo 用户则插入（密码 123456）
 * 与前端约定：客户端发送 SHA-256(密码)，此处存储 bcrypt(SHA256('123456'))
 */
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const db = require('./db');

function sha256Hex(str) {
  return crypto.createHash('sha256').update(str, 'utf8').digest('hex');
}

async function initSeed() {
  try {
    const clientPassword = sha256Hex('123456');
    const hash = bcrypt.hashSync(clientPassword, 10);
    await db.execute(
      'INSERT INTO `user` (username, password_hash, nickname) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE password_hash = ?, nickname = ?',
      ['demo', hash, '演示用户', hash, '演示用户']
    );
    console.log('Seed: 测试账号 demo / 123456 已就绪（密码已按前端加密约定存储）');
  } catch (e) {
    console.warn('Seed skip or error:', e.message);
  }
}

module.exports = initSeed;
