const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const router = express.Router();

const key = process.env.SECRET_KEY;

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { username, password, token } = req.body;
    let email;
    if (!token) {
      return res.status(400).json({ success: false, message: "Token is required" });
    }

    try {
      const decoded = jwt.verify(token, key);
      email = decoded.email;
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ success: false, message: "Token has expired" });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ success: false, message: "Invalid or malformed token" });
      } else {
        return res.status(500).json({ success: false, message: "Token verification failed", error: error.message });
      }
    }

    // Validate email domain
    if (!email.endsWith("@umt.edu.pk")) {
      return res.status(403).json({ success: false, message: "Please use your UMT email to register" });
    }

    const alreadyRegistered = await User.findOne({ email });
    if (alreadyRegistered) {
      return res.status(400).json({ success: false, message: "You are already registered" });
    }
    // Check if username is already taken
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }
    const newUser = new User({
      username,
      email,
      password
    });

    // Hash password before saving in database
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the new user to the database
    const savedUser = await newUser.save();

    // Create JWT Payload
    const payload = {
      name: username,
      role: newUser.role,
    };

    const token1 = jwt.sign(payload, key, { expiresIn: '4h' });
    return res.json({
      success: true,
      token: 'Bearer ' + token1,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


// router.post('/register', async (req, res) => {
//   try {
//     const { username, email, password } = req.body;



//     // Check if username is already taken
//     const existingUser = await User.findOne({ username });
//     if (existingUser) {
//       return res.status(400).json({ success: false, message: "Username already taken" });
//     }
//     const newUser = new User({
//       username,
//       email,
//       password
//     });

//     // Hash password before saving in database
//     const salt = await bcrypt.genSalt(10);
//     newUser.password = await bcrypt.hash(password, salt);

//     // Save the new user to the database
//     const savedUser = await newUser.save();

//     // Create JWT Payload
//     const payload = {
//       id: savedUser._id,
//       name: username,
//       role: 'user',
//     };

//     const token1 = jwt.sign(payload, key, { expiresIn: '4h' });
//     return res.json({
//       success: true,
//       token: 'Bearer ' + token1,
//       userId: savedUser._id
//     });
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ success: false, message: 'Server error' });
//   }
// });



router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by email
    User.findOne({ username }).then(user => {
      if (!user) {
        return res.status(404).json({ username: 'User not found' });
      }

      // Check password
      bcrypt.compare(password, user.password).then(isMatch => {
        if (isMatch) {

          const payload = {
            name: username,
            role: user.role,
          };

          // Sign token
          jwt.sign(
            payload,
            key,
            { expiresIn: '4h' },
            (err, token) => {
              res.json({
                success: true,
                token: 'Bearer ' + token,
              });
            }
          );
        } else {
          return res.status(400).json({ message: 'Password Incorrect' });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});


module.exports = router;
