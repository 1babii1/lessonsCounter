const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    lessonsCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    group: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
