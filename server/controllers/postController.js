const pool = require('../db');

module.exports = {
    async getAllPosts(req, res) {
        try {
            const posts = await pool.query('SELECT * FROM posts');
            res.status(200).json(posts.rows);
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while fetching posts' });
        }
    },

    async createPost(req, res) {
        try {
            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ message: 'Title and content are required' });
            }

            const newPost = await pool.query(`
                INSERT INTO posts (title, content, user_id)
                VALUES ($1, $2, $3) RETURNING *`,
                [title, content, req.user.userId]
            );

            res.status(201).json(newPost.rows[0]);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while creating the post' });
        }
    },

    async updatePost(req, res) {
        try {
            const { title, content } = req.body;

            if (!title || !content) {
                return res.status(400).json({ message: 'Title and content are required' });
            }

            const updatedPost = await pool.query(`
                UPDATE posts
                SET title = $1, content = $2
                WHERE post_id = $3 AND user_id = $4
                RETURNING *`,
                [title, content, req.params.id, req.user.userId]
            );

            if (updatedPost.rows.length === 0) {
                return res.status(400).json({ message: 'Post not found or unauthorized' });
            }

            res.status(200).json(updatedPost.rows[0]);

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while updating the post' });
        }
    },

    async deletePost(req, res) {
        try {
            const deletedPost = await pool.query(`
                DELETE FROM posts
                WHERE post_id = $1 AND user_id = $2
                RETURNING *`,
                [req.params.id, req.user.userId]
            );

            if (deletedPost.rows.length === 0) {
                return res.status(400).json({ message: 'Post not found or unauthorized' });
            }

            res.status(200).json({ message: 'Post successfully deleted' });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while deleting the post' });
        }
    }
}
