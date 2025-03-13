const pool = require('../db')
const { hashPassword, verifyPassword } = require('../helpers/hashPassword');
const router = require('express').Router();
const { generateToken } = require('../helpers/jwt');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).send({ message: 'Name, email and password are required' });
        }
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            return res.status(400).send({ message: 'Invalid email format' });
        }
        const checkUser = await pool.query(`select * from users where email = $1`, [email]);
        if (checkUser.rows.length > 0) {
            return res.status(400).send({ message: 'Email already exists' });
        };

        const hashedPass = await hashPassword(password);
        const newUser = await pool.query(`
        insert into users(name, email, password) 
        values($1, $2, $3) returning * `,
            [name, email, hashedPass]);
        res.status(201).send({ message: name, email: email });
    } catch (err) {
        console.log(err)
    }
})

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send({ message: 'Email and password are required' });
        };
        const result = await pool.query('select * from users where email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(400).send({ message: 'User not found' });
        }
        const user = result.rows[0];
        const isMatch = await verifyPassword(password, user.password)
        const token = generateToken(user)
        if (isMatch) {
            return res.status(200).send({ token: token, user: { id: user.user_id, name: user.name, email: user.email } });
        } else {
            res.status(400).send({ message: 'Invalid password' });
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
});

module.exports = router