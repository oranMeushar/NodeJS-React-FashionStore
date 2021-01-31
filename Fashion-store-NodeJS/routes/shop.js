const express = require('express');
const router = express.Router();

const shopController = require('../controllers/shopController');
const handleQuery = require('../middleware/handleQuery');
const Shop = require('../model/Shop');

router.get('/', handleQuery(Shop), shopController.getCollections);
router.post('/contact', shopController.contactUs);
router.get('/:category',handleQuery(Shop), shopController.getCollection)

module.exports = router;