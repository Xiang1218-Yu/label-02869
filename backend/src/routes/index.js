/**
 * 路由汇总：挂载各 Controller
 */
const express = require('express');
const AuthController = require('../controllers/AuthController');
const ProductController = require('../controllers/ProductController');
const CartController = require('../controllers/CartController');
const auth = require('../middleware/auth');

const router = express.Router();

// 认证（无需登录）
router.post('/auth/login', AuthController.login);
router.post('/auth/register', AuthController.register);
router.get('/auth/me', auth, AuthController.me);

// 商品（无需登录）
router.get('/products', ProductController.list);
router.get('/products/:id', ProductController.getById);

// 购物车（需登录）
router.get('/cart', auth, CartController.list);
router.post('/cart', auth, CartController.add);
router.delete('/cart/:productId', auth, CartController.remove);

module.exports = router;
