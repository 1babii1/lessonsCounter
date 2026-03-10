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
    // history of lesson modifications
    history: [
        {
            change: { type: Number, required: true }, // positive for add, negative for removal
            date: { type: Date, default: Date.now },
        },
    ],
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
