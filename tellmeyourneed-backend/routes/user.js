// const express = require('express');
// const router = express.Router();
// const protectRoute = require('../middleware/auth');
// const Need= require('../Models/Need');
// const User= require('../Models/User');

// router.post('/need', async (req, res) => {
//   try {
//     const { 
//       username,
//       title, 
//       description, 
//       category, 
//       imageUrls 
//     } = req.body;

//     if (!username || !category) {
//       return res.status(400).json({ msg: 'Please include all required fields: user (with username), title, description, and category.' });
//     }

//     // const validCategories = ['Project', 'Notes', 'Assignment', 'Study', 'other'];
//     // if (!validCategories.includes(category)) {
//     //   return res.status(400).json({ msg: `Invalid category. Must be one of: ${validCategories.join(', ')}` });
//     // }

//     // const validStatuses = ['open', 'assigned', 'closed'];
//     // if (status && !validStatuses.includes(status)) {
//     //   return res.status(400).json({ msg: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
//     // }

//     // if (imageUrls && !imageUrls.every(url => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(url))) {
//     //   return res.status(400).json({ msg: 'One or more image URLs are invalid.' });
//     // }

//     const newNeed = new Need({
//       user: {
//         username: username
//       },
//       title,
//       description,
//       category,
//       imageUrls: imageUrls || []
//     });

//     const savedNeed = await newNeed.save();

//     res.status(201).json(savedNeed);

//   } catch (err) {
//     console.error(err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// });
// router.get('/profile/:name', async (req, res) => {
//   try {
//    const user = await User.find({ "username": req.params.name });
      
//        if (!user || user.length === 0) {
//          return res.status(404).json({ message: 'user no found' });
//        }
   
//        res.json( user);
//   } catch (error) {
//     console.error("Error Fetchng Profile :", error.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });

// router.put("/profile", async (req, res) => {
//   try {
//     const { username, picture,  description } = req.body;

//     if (!username || !picture || description) {
//       return res.status(400).json({ message: "Username and updated profile data are required" });
//     }

//     const user = await User.findOneAndUpdate(
//       { username },
//       { $set: { picture, description } },
//       { new: true, runValidators: true }
//     );

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json({ message: "Profile updated successfully", user });
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// });


// router.put('/need/:id', async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       category,
//       status,
//       assignedTo,
//       imageUrls,
//     } = req.body; 

//     const updatedNeed = await Need.findByIdAndUpdate(
//       req.params.id, 
//       {
//         $set: {
//           title,
//           description,
//           category,
//           status,
//           assignedTo,
//           imageUrls,
//         },
//       },
//       { new: true, runValidators: true } 
//     );

   
//     if (!updatedNeed) {
//       return res.status(404).json({ msg: "Need not found" });
//     }

//     res.status(200).json(updatedNeed);
//   } catch (error) {
//     console.error("Error updating the need:", error.message);
//     res.status(500).json({ msg: "Server error" });
//   }
// });
// module.exports = router;
