// Required Dependencies
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const passport = require('passport');
const session = require("express-session");
const dotenv = require('dotenv');
const initializeSocket = require("./Socket/socket");
const googleAuth = require('./Auth/googleAuth');

// Environment Variables
dotenv.config();
const authRoutes = require('./Auth/auth');
const apiRoutes = require('./routes/api');

// const Need = require('./Models/Need')
// const User = require('./Models/User')
// const Report = require('./Models/Report')
// const Message = require('./Models/Message')
// App Setup
const app = express();
const server = http.createServer(app);
initializeSocket(server);


// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SECRET_KEY, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
const connectDB = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_URL);
      console.log("MongoDB connected");
    }
  } catch (error) {
    console.error("MongoDB Error:", error);
  }
};
connectDB();
mongoose.connection.on("disconnected", connectDB);

// Initialize Google Auth routes
googleAuth(app);

// Use routes
app.use('/api', apiRoutes);
app.use('/auth', authRoutes);
// Health check to avoid Railway idle shutdown
app.get("/health", (_, res) => res.send("OK"));

app.get("/", (req, res) => {
  res.send("Server running & API working ✅");
});
// const deleteNeeds = async () => {
//   try {
//     const deletedNeed = await Need.deleteMany({});
//     if (!deletedNeed) {
//       return { success: false, message: "Need not found" };
//     }
//     return { success: true, message: "Need deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting need:", error);
//     return { success: false, message: "Error deleting need" };
//   }
// };

// deleteNeeds().then(response => console.log(response));
// const deleteUsers = async () => {
//   try {
//     const deletedUser = await User.deleteMany({});
//     if (!deletedUser) {
//       return { success: false, message: "User not found" };
//     }
//     return { success: true, message: "User deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return { success: false, message: "Error deleting user" };
//   }
// };

// deleteUsers().then(response => console.log(response));

// const deleteReports = async () => {
//   try {
//     const deletedReport = await Report.deleteMany({});
//     if (!deletedReport) {
//       return { success: false, message: "Report not found" };
//     }
//     return { success: true, message: "Reports deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting reports:", error);
//     return { success: false, message: "Error deleting reports" };
//   }
// };

// deleteReports().then(response => console.log(response));
// const deleteMessages = async () => {
//   try {
//     const deletedMessage = await Message.deleteMany({});
//     if (!deletedMessage) {
//       return { success: false, message: "Message not found" };
//     }
//     return { success: true, message: "Messages deleted successfully" };
//   } catch (error) {
//     console.error("Error deleting messages:", error);
//     return { success: false, message: "Error deleting messages" };
//   }
// };

// deleteMessages().then(response => console.log(response));
// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
