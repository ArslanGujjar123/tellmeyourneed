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

const Need  = require('./Models/Need')

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
// const deleteNeedById = async () => {
//     try {
//         const deletedNeed = await Need.deleteMany({});
//         if (!deletedNeed) {
//             return { success: false, message: "Need not found" };
//         }
//         return { success: true, message: "Need deleted successfully" };
//     } catch (error) {
//         console.error("Error deleting need:", error);
//         return { success: false, message: "Error deleting need" };
//     }
// };

// // Example usage
// const id = "6820b46d12222bbd1324e229";
// deleteNeedById().then(response => console.log(response));


// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
