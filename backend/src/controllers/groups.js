const Group = require('../models/Group');

exports.getGroups = async (req, res) => {
    try {
        const groups = await Group.find({ user: req.user._id });
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const group = await Group.create({ name, user: req.user._id });
        res.status(201).json(group);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteGroup = async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        if (group.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await group.remove();
        res.json({ message: 'Group removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
