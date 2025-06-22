const User = require('../Models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.find({ "username": req.params.name });

        if (!user || user.length === 0) {
            return res.status(404).json({ message: 'user no found' });
        }

        res.json(user);
    } catch (error) {
        console.error("Error Fetchng Profile :", error.message);
        res.status(500).json({ msg: "Server error" });
    }
};

exports.updateUserProfile = async (req, res) => {

    try {
        const { username, picture, description } = req.body;
        if (!username) {
            return res.status(400).json({ message: "Username is required" });
        }

        const user = await User.findOneAndUpdate(
            { username },
            { $set: { picture, description } },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.getAllUsers = async (req, res) => {
    try {
        const users = User.find();
        if (!users) {
            return res.status(404).json({ message: "No User found" });
        }
        res.json({ users })
    } catch (error) {
        console.error("error fetching users", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error Finding user' });
    }
}
exports.blockorUnBlockUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const isBlocked = req.params.blockStatus === "true";


        const updatedUser = await User.findByIdAndUpdate(userId, { isBlocked }, { new: true });

        if (updatedUser) {
            res.json({ message: `User ${isBlocked ? "blocked" : "unblocked"} successfully`, user: updatedUser });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating user block status', error: error.message });
    }
}
exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user' });
    }
}