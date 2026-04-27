const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.use(protect);

router.post('/', createOrder);
router.get('/myorders', getMyOrders);
router.get('/all', admin, getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', admin, updateOrderStatus);

module.exports = router;
