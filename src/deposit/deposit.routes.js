const express = require('express');
const { createDepositTransaction, handleMidtransNotification } = require('./deposit.controller');
const authenticateUser = require("../auth/auth.middleware");

const router = express.Router();

// Endpoint untuk deposit, hanya bisa diakses oleh pengguna yang terautentikasi
router.post('/new', authenticateUser, createDepositTransaction);

// Endpoint untuk menerima notifikasi dari Midtrans (Tanpa autentikasi)
router.post('/notification', handleMidtransNotification);

module.exports = router;
