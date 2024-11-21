const snap = require('../config/midtrans');
const crypto = require('crypto');
const { createDeposit, updateDepositStatus, addSaldoToUser, getUserIdByOrderId } = require('./deposit.service');

// Fungsi untuk membuat transaksi deposit
exports.createDepositTransaction = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id; // Ambil userId dari token JWT

    const orderId = `tx-${Date.now()}`; // Generate order_id unik berdasarkan timestamp

    try {
        await createDeposit(userId, amount, orderId);

        const transaction = await snap.createTransaction({
            transaction_details: {
                order_id: orderId,
                gross_amount: amount,
            },
            customer_details: {
                email: req.user.email,
            },
        });

        res.status(201).json({
            message: 'Transaksi deposit berhasil dibuat',
            transaction,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Fungsi untuk menghasilkan signature Midtrans
const generateSignature = (order_id, status_code, gross_amount, serverKey) => {
    const input = `${order_id}${status_code}${gross_amount}${serverKey}`;
    const signature = crypto.createHash('sha512').update(input).digest('hex');
    return signature;
};

// Fungsi untuk menangani notifikasi dari Midtrans
exports.handleMidtransNotification = async (req, res) => {
    const notification = req.body;
    const serverKey = "SB-Mid-server-MfkAjiPObqTJpovidnqxBtoH"; // Gantilah dengan server key Anda yang sebenarnya

    // Log untuk debugging
    console.log("Received Notification:", notification);

    try {
        // Ambil data dari notifikasi Midtrans
        const { order_id, transaction_status, status_code, gross_amount, signature_key } = notification;

        // Verifikasi bahwa semua parameter yang diperlukan ada
        if (!order_id || !status_code || !gross_amount || !signature_key) {
            return res.status(400).json({ message: 'Incomplete notification data' });
        }

        // Format jumlah transaksi agar sesuai dengan dua angka desimal
        const formattedAmount = parseFloat(gross_amount).toFixed(2);

        // Menghasilkan signature yang diharapkan berdasarkan data yang diterima
        const expectedSignature = generateSignature(order_id, status_code, formattedAmount, serverKey);

        // Verifikasi signature
        if (signature_key !== expectedSignature) {
            return res.status(400).json({ message: 'Invalid signature key' });
        }

        // Ambil userId berdasarkan order_id
        const userId = await getUserIdByOrderId(order_id); // Dapatkan userId dari database berdasarkan order_id

        // Proses status transaksi berdasarkan status dari Midtrans
        if (transaction_status === 'settlement') {
            await updateDepositStatus(order_id, 'success');
            await addSaldoToUser(userId, formattedAmount); // Tambah saldo pengguna
        } else if (transaction_status === 'pending') {
            await updateDepositStatus(order_id, 'pending');
        } else if (transaction_status === 'expire' || transaction_status === 'cancel') {
            await updateDepositStatus(order_id, 'failed');
        }

        res.status(200).json({ message: 'Notifikasi berhasil diproses' });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    }
};
