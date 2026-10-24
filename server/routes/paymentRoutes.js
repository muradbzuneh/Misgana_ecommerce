const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../controllers/paymentController');
const { authMiddleware } = require('../middleware/authMiddleware');
router.post('/create',authMiddleware, createPaymentIntent);
module.exports = router;