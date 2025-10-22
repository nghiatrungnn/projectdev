const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { verifyToken, verifyAdmin } = require('../middlewares/auth.middleware');

router.post('/', verifyToken, orderController.createOrder);
router.get('/my', verifyToken, orderController.getMyOrders);
router.get('/', verifyToken, verifyAdmin, orderController.getAllOrders);
router.put('/:id/status', verifyToken, verifyAdmin, orderController.updateOrderStatus);

module.exports = router;
