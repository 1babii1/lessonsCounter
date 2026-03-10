const Student = require('../models/Student');
const Group = require('../models/Group');

exports.getStudentsByGroup = async (req, res) => {
    try {
        const students = await Student.find({ group: req.params.groupId });
        res.json(students);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createStudent = async (req, res) => {
    try {
        const { name, groupId } = req.body;

        // Verify group belongs to user
        const group = await Group.findById(groupId);
        if (!group || group.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const student = await Student.create({ name, group: groupId });
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateLessons = async (req, res) => {
    try {
        const { amount } = req.body; // Positive to add, negative to subtract
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Verify group belongs to user
        const group = await Group.findById(student.group);
        if (!group || group.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        student.lessonsCount += amount;
        if (student.lessonsCount < 0) student.lessonsCount = 0; // Prevent negative lessons

        await student.save();
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const group = await Group.findById(student.group);
        if (!group || group.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await student.remove();
        res.json({ message: 'Student removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
