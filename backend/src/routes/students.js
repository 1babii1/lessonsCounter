const express = require('express');
const { getStudentsByGroup, createStudent, updateLessons, deleteStudent } = require('../controllers/students');
const { protect } = require('../utils/authMiddleware');

const router = express.Router();

router.route('/group/:groupId')
    .get(protect, getStudentsByGroup);

router.route('/')
    .post(protect, createStudent);

router.route('/:id')
    .put(protect, updateLessons) // Use body {amount: X} for adding or subtracting lessons
    .delete(protect, deleteStudent);

module.exports = router;
