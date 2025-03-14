const { getAllPosts, createPost, updatePost, deletePost } = require('../controllers/postController');
const auth = require('./middleware');
const router = require('express').Router();

router.get('/', getAllPosts);
router.post('/', auth, createPost);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost)

module.exports = router;