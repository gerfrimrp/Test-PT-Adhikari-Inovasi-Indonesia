const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const pool = require('./db');
const hashPassword = require('./helpers/hashPassword');
const verifyPassword = require('./helpers/hashPassword')

app.use(cors())
app.use(express.json())

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log(name, email, password);
    } catch (err) {
        console.log(err)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('select * from users where email = $1', [email]);
        if (result.length === 0) {
            return res.status(400).send({ message: 'User not found' });
        }
        const user = result.rows[0];
        const isMatch = await verifyPassword(password, user.password)
        if (isMatch) {
            return res.status(200).send({ message: 'Logged in' });
        } else {
            res.status(400).send({ message: 'Invalid credentials' });
        };
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})