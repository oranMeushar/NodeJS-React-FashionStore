const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');
const protected = require('../middleware/protected');

router.post('/', protected, ordersController.postOrder);
router.get('/', protected, ordersController.getOrders);
router.get('/:orderId', protected, ordersController.getOrder);
router.delete('/:orderId', protected, ordersController.deleteOrder);
module.exports = router;