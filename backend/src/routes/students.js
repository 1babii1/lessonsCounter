const express = require('express');
const { getStudentsByGroup, createStudent, updateLessons, deleteStudent, getHistory } = require('../controllers/students');
const { protect } = require('../utils/authMiddleware');

const router = express.Router();

router.route('/group/:groupId')
    .get(protect, getStudentsByGroup);

router.route('/')
    .post(protect, createStudent);

router.route('/:id')
    .put(protect, updateLessons) // Use body {amount: X} for adding or subtracting lessons
    .delete(protect, deleteStudent);

// history endpoint (protected)
router.get('/:id/history', protect, getHistory);

module.exports = router;
