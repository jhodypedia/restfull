const jwt = require('jsonwebtoken');

// Middleware untuk autentikasi menggunakan JWT
const authenticateUser = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Format: "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: Token not provided' });
    }

    try {
        // Verifikasi token menggunakan secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan informasi pengguna dalam req
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};

module.exports = authenticateUser;
