const express = require('express');
const router = express.Router();
const {
    addCourse,
    getEnrollments,
    removeCourse,
    updateEnrollmentStatus
} = require('../controllers/enrollmentController');
const auth = require('./middleware');

router.post('/', auth, addCourse);
router.get('/:user_id', auth, getEnrollments);
router.delete('/', auth, removeCourse);
router.put('/', auth, updateEnrollmentStatus);

module.exports = router;
