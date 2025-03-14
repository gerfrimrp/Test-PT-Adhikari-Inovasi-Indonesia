const pool = require('../db');
const { hashPassword, verifyPassword } = require('../helpers/hashPassword');
const { generateToken } = require('../helpers/jwt');

module.exports = {
    async register(req, res) {
        try {
            const { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({ message: 'Name, email, and password are required' });
            }

            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }

            const checkUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (checkUser.rows.length > 0) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const hashedPass = await hashPassword(password);

            const newUser = await pool.query(`
                INSERT INTO users (name, email, password)
                VALUES ($1, $2, $3) RETURNING *`,
                [name, email, hashedPass]
            );

            res.status(201).json({
                message: 'User registered successfully',
                user: {
                    name: newUser.rows[0].name,
                    email: newUser.rows[0].email
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async login(req, res) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
            if (result.rows.length === 0) {
                return res.status(400).json({ message: 'User not found' });
            }

            const user = result.rows[0];

            const isMatch = await verifyPassword(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            const token = generateToken(user);

            res.status(200).json({
                message: 'Login successful',
                token: token,
                user: {
                    id: user.user_id,
                    name: user.name,
                    email: user.email
                }
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
};
