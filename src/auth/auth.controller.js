const { hashPassword, verifyPassword, generateToken, findUserByEmail, createUser, updatePassword } = require('./auth.service');

// Register
exports.register = async (req, res) => {
    const { username, email, password, phone } = req.body;
    try {
        // Mengecek apakah email sudah digunakan
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already taken' });
        }

        // Hash password sebelum disimpan
        const hashedPassword = await hashPassword(password);
        await createUser(username, email, hashedPassword, phone);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ message: 'Email not found' });

        // Verifikasi password
        const isPasswordValid = await verifyPassword(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: 'Invalid password' });

        // Generate token JWT dengan payload { id, role, email }
        const token = generateToken({ id: user.id, role: user.role, email: user.email });

        res.status(200).json({ message: 'Login successful', token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    try {
        const user = await findUserByEmail(email);
        if (!user) return res.status(404).json({ message: 'Email not found' });

        // Hash password baru sebelum disimpan
        const hashedPassword = await hashPassword(newPassword);
        await updatePassword(email, hashedPassword);

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Logout (Stateless)
exports.logout = (req, res) => {
    res.status(200).json({ message: 'Logout successful' });
};
