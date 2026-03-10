const express = require('express');
const { getGroups, createGroup, deleteGroup } = require('../controllers/groups');
const { protect } = require('../utils/authMiddleware');

const router = express.Router();

router.route('/')
    .get(protect, getGroups)
    .post(protect, createGroup);

router.route('/:id')
    .delete(protect, deleteGroup);

module.exports = router;
