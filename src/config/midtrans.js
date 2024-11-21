const midtransClient = require('midtrans-client');

// Inisialisasi Snap API
const snap = new midtransClient.Snap({
    isProduction: false, // Ubah ke true jika production
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

module.exports = snap;
