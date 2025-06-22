const Need = require('../Models/Need');

exports.createNeed = async (req, res) => {
    try {
        const {
            username,
            title,
            description,
            category,
            imageUrls
        } = req.body;

        if (!username || !category) {
            return res.status(400).json({ msg: 'Please include all required fields: user (with username), title, description, and category.' });
        }

        const newNeed = new Need({
            user: {
                username: username
            },
            title,
            description,
            category,
            imageUrls: imageUrls || []
        });

        const savedNeed = await newNeed.save();
        res.status(201).json(savedNeed);

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.updateNeed = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            status,
            assignedTo,
            imageUrls,
        } = req.body;

        const updatedNeed = await Need.findByIdAndUpdate(
            req.params.id,
            {
                $set: {
                    title,
                    description,
                    category,
                    status,
                    assignedTo,
                    imageUrls,
                },
            },
            { new: true, runValidators: true }
        );

        if (!updatedNeed) {
            return res.status(404).json({ msg: "Need not found" });
        }

        res.status(200).json(updatedNeed);
    } catch (error) {
        console.error("Error updating the need:", error.message);
        res.status(500).json({ msg: "Server error" });
    }
};
exports.getAllNeeds = async (req, res) => {
    try {
        const needs = await Need.find();
        if (!needs || needs.length === 0) {
            return res.status(404).json({ message: 'No one has posted need yet.' });
        }
        res.json({ needs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserNeeds = async (req, res) => {
    try {
        const needs = await Need.find({ "user.username": req.params.name });
        if (!needs || needs.length === 0) {
            return res.status(404).json({ message: 'You have no need yet.' });
        }
        res.json({ needs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAssignedNeeds = async (req, res) => {
    try {
        const needs = await Need.find({ "assignedTo.username": req.params.name });
        if (!needs) {
            return res.status(404).json({ message: 'There is no need assigned to you yet.' });
        }
        res.json({ needs });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteNeed = async (req, res) => {
    try {
        await Need.findByIdAndDelete(req.params.id);
        res.json({ message: 'Need deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting need' });
    }
};

exports.changeNeedStatus = async (req, res) => {
    console.log("status", req.body.status);
    console.log("assignedTo", req.body.assignedTo);
    try {
        const need = await Need.findById(req.params.id);
        if (!need) {
            return res.status(404).json({ message: 'Need not found' });
        }
        need.status = req.body.status;
        if (req.body.status === 'assigned') {
            need.assignedTo.username = req.body.assignedTo;
        } else {
            need.assignedTo.username = null;
        }
        await need.save();
        res.json({ message: 'Need status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating need status' });
    }
};

