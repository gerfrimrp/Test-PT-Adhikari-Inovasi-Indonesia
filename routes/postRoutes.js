const pool = require('../db');
const auth = require('../middleware');
const router = require('express').Router();

router.get('/', auth, async (req, res) => {
    try {
        const posts = await pool.query(`select * from posts`);
        res.status(200).send(posts.rows);
    } catch (err) {
        console.log(err)
    }
})

router.post('/create', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send({ message: 'Title and content are required' });
        };
        const newPost = await pool.query(`
        insert into posts(title, content, user_id)
        values($1, $2, $3) returning *`,
            [title, content, req.user.userId]
        );
        res.status(201).send(newPost.rows[0]);

    } catch (err) {
        console.log(err);
    }
});

router.put('/update/:id', auth, async (req, res) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res.status(400).send({ message: 'Title and content are required' });
        };
        const updatedPost = await pool.query(`
        update posts set title = $1, content = $2
        where post_id = $3 and user_id = $4 returning *`,
            [title, content, req.params.id, req.user.userId]
        );
        if (updatedPost.rows.length === 0) {
            return res.status(400).send({ message: 'Post not found or unauthorized' })
        }
        res.status(200).send(updatedPost.rows[0])
    } catch (err) {
        console.log(err);
    }
});

router.delete('/delete/:id', auth, async (req, res) => {
    try {
        const deletedPost = await pool.query(`
        delete from posts where post_id = $1 and user_id = $2 returning *`,
            [req.params.id, req.user.userId]
        );
        if (deletedPost.rows.length === 0) {
            return res.status(400).send({ message: 'Post not found or unauthorized' })
        }
        res.status(200).send(deletedPost.rows[0])
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;