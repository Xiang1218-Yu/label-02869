/**
 * MySQL 连接池
 * 使用 mysql2/promise，config 中 charset: 'utf8mb4' 已保证读写字符集
 */
const mysql = require('mysql2/promise');
const config = require('./config');

const pool = mysql.createPool(config.db);

module.exports = pool;
