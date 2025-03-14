const express = require('express')
const app = express()
const port = 4000
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const pool = require('./db');

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes);
app.use('/enrollment', enrollmentRoutes);
app.get('/', async (req, res) => {
    try {
        const courses = await pool.query('SELECT * FROM courses');
        res.status(200).json(courses.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'An error occurred while fetching courses' });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})