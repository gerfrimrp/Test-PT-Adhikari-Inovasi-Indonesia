const express = require('express')
const app = express()
const port = 3000
const cors = require('cors');
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')

app.use(cors())
app.use(express.json())

app.use('/users', userRoutes);
app.use('/posts', postRoutes)

app.get('/', async (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})