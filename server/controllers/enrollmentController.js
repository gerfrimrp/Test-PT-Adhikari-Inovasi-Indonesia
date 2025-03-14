const pool = require('../db');

module.exports = {
    async addCourse(req, res) {
        try {
            const { user_id, course_id } = req.body;

            const checkEnrollment = await pool.query(
                `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
                [user_id, course_id]
            );

            if (checkEnrollment.rows.length > 0) {
                return res.status(400).json({ message: 'You are already enrolled in this course' });
            }

            const newEnrollment = await pool.query(
                `INSERT INTO enrollments (user_id, course_id) VALUES ($1, $2) RETURNING *`,
                [user_id, course_id]
            );

            res.status(201).json({
                message: 'Course added successfully',
                enrollment: newEnrollment.rows[0]
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while adding the course' });
        }
    },

    async getEnrollments(req, res) {
        try {
            const { user_id } = req.params;

            const enrollments = await pool.query(
                `SELECT e.enrollment_id, e.user_id, e.course_id, e.enrollment_date, e.status, c.title, c.course_type, c.instructor_name, c.course_date 
                 FROM enrollments e
                 JOIN courses c ON e.course_id = c.course_id
                 WHERE e.user_id = $1`,
                [user_id]
            );

            res.status(200).json({
                enrollments: enrollments.rows
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while fetching enrollments' });
        }
    },

    async removeCourse(req, res) {
        try {
            const { user_id, course_id } = req.body;

            const checkEnrollment = await pool.query(
                `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
                [user_id, course_id]
            );

            if (checkEnrollment.rows.length === 0) {
                return res.status(400).json({ message: 'You are not enrolled in this course' });
            }

            await pool.query(
                `DELETE FROM enrollments WHERE user_id = $1 AND course_id = $2`,
                [user_id, course_id]
            );

            res.status(200).json({ message: 'Course removed successfully' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while removing the course' });
        }
    },

    async updateEnrollmentStatus(req, res) {
        try {
            const { user_id, course_id, status } = req.body;

            const validStatuses = ['enrolled', 'in-progress', 'finished'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }

            const checkEnrollment = await pool.query(
                `SELECT * FROM enrollments WHERE user_id = $1 AND course_id = $2`,
                [user_id, course_id]
            );

            if (checkEnrollment.rows.length === 0) {
                return res.status(400).json({ message: 'Enrollment not found' });
            }

            const updatedEnrollment = await pool.query(
                `UPDATE enrollments
                 SET status = $1
                 WHERE user_id = $2 AND course_id = $3
                 RETURNING *`,
                [status, user_id, course_id]
            );

            res.status(200).json({
                message: 'Enrollment status updated successfully',
                enrollment: updatedEnrollment.rows[0]
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'An error occurred while updating the enrollment status' });
        }
    },
};
