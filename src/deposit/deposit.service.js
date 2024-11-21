const db = require('../config/db');

// Simpan transaksi deposit
const createDeposit = (userId, amount, orderId) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO deposits (user_id, amount, order_id, status) VALUES (?, ?, ?, ?)';
        db.query(sql, [userId, amount, orderId, 'pending'], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Update status deposit berdasarkan orderId
const updateDepositStatus = (orderId, status) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE deposits SET status = ? WHERE order_id = ?';
        db.query(sql, [status, orderId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Tambahkan saldo pengguna
const addSaldoToUser = (userId, amount) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET saldo = saldo + ? WHERE id = ?';
        db.query(sql, [amount, userId], (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

// Mengambil userId berdasarkan orderId
const getUserIdByOrderId = (orderId) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT user_id FROM deposits WHERE order_id = ?';
        db.query(sql, [orderId], (err, results) => {
            if (err) reject(err);
            if (results.length === 0) {
                reject('Order ID tidak ditemukan');
            } else {
                resolve(results[0].user_id);
            }
        });
    });
};

module.exports = { createDeposit, updateDepositStatus, addSaldoToUser, getUserIdByOrderId };
