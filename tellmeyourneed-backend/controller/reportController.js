const Report = require('../Models/Report');

exports.getAllReports = async (req, res) => {
    try {
        const reports = await Report.find();
        if (!reports) {
            res.status(404).json({ message: "No Report Found" });
        }
        res.json({ reports });
    } catch (error) {
        res.status(500).json({ message: "Error Finding Report" });
    }
}
exports.createReport = async (req, res) => {
    const { reporter, reportedUser, description, category, imageUrl } = req.body;
    console.log("sd", req.body);
    console.log(reporter, reportedUser, description, category, imageUrl);
    try {
        const report = new Report({ reporter, reportedUser, description, category, imageUrl });
        await report.save();
        res.status(201).json({ message: "Report Created Successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error Creating Report" });
    }
}
exports.getReportsByUsername = async (req, res) => {
    try {
        const reports = await Report.find({ reporter: req.params.username });
        res.json({ reports });
    } catch (error) {
        res.status(500).json({ message: "Error Finding Report" });
    }
}   