-- 水果店数据库建表脚本 (MySQL 8.0)
-- 务必以 UTF-8 编码保存本文件；初始化时指定客户端字符集，避免中文乱码
CREATE DATABASE IF NOT EXISTS fruit_shop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE fruit_shop;
SET NAMES 'utf8mb4' COLLATE 'utf8mb4_unicode_ci';

-- 用户表
CREATE TABLE IF NOT EXISTS `user` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(64) NOT NULL COMMENT '登录名',
  `password_hash` VARCHAR(255) NOT NULL COMMENT '密码哈希',
  `nickname` VARCHAR(64) DEFAULT NULL COMMENT '昵称',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- 商品表
CREATE TABLE IF NOT EXISTS `product` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL COMMENT '商品名称',
  `cover_url` VARCHAR(512) DEFAULT NULL COMMENT '封面图',
  `description` TEXT COMMENT '描述',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '单价',
  `stock` INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '库存',
  `unit` VARCHAR(16) NOT NULL DEFAULT '份' COMMENT '单位',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品表';

-- 购物车项表
CREATE TABLE IF NOT EXISTS `cart_item` (
  `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT UNSIGNED NOT NULL COMMENT '用户ID',
  `product_id` BIGINT UNSIGNED NOT NULL COMMENT '商品ID',
  `quantity` INT UNSIGNED NOT NULL DEFAULT 1 COMMENT '数量',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_product` (`user_id`,`product_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cart_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='购物车项';

-- 初始数据：测试用户 (密码 123456，hash 由 backend 的 scripts/seed.js 写入)
-- 初始商品（长描述便于详情页展示）
INSERT INTO `product` (`name`, `cover_url`, `description`, `price`, `stock`, `unit`) VALUES
('新鲜苹果', 'https://copyright.bdstatic.com/vcg/creative/9904f90bae365cbabf0e3422ae79d141c1d437ab.jpg@wm_1,k_cGljX2JqaHdhdGVyLmpwZw==', '产自陕西、山东等优质产区，果皮红润或青脆，果肉脆甜多汁，富含膳食纤维与维生素 C。适合直接鲜食或榨汁，冷藏后口感更佳。', 12.80, 100, '斤'),
('进口橙子', 'https://inews.gtimg.com/news_bt/OI0ANxJ0BVJle2rsxDXxauF02OxHq3AXKmdzNzaRzWKSUAA/641', '精选进口脐橙，酸甜适中，维 C 丰富，果肉饱满无渣。适合补充每日维生素、增强免疫力，亦可榨汁或做果盘。', 9.90, 80, '斤'),
('海南香蕉', 'https://img2.baidu.com/it/u=3733023367,2730633383&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=749g', '海南直供香蕉，自然熟成，软糯香甜，富含钾元素。可直接食用或搭配燕麦、酸奶，是早餐与加餐的理想选择。', 6.50, 120, '斤'),
('新疆葡萄', 'https://inews.gtimg.com/om_bt/O-Ul5CKLwIKZcvqvKC04iCq0V5IhMwvI0SLVlAM2Ad8OwAA/1000', '新疆无籽葡萄，颗颗饱满、甜度高、皮薄多汁。适合鲜食或制成果汁，冷藏后风味更佳。', 18.00, 60, '斤'),
('泰国榴莲', 'https://img0.baidu.com/it/u=66075833,3460728373&fm=253&fmt=auto&app=138&f=JPEG?w=333&h=500', '泰国金枕榴莲，果肉饱满、香味浓郁、口感绵密。开壳即食或冷冻后口感似冰淇淋，是榴莲爱好者的首选。', 88.00, 30, '个');
