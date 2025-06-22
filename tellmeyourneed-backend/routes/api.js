const express = require('express');
const router = express.Router();
const protectRoute = require('../middleware/auth');
const needController = require('../controller/needController');
const userController = require('../controller/userController');
const messageController = require('../controller/messageController');
const reportController = require('../controller/reportController');

// Need routes
router.get('/needs', protectRoute(['user']), needController.getAllNeeds);
router.get('/needs/:name', protectRoute(['user']), needController.getUserNeeds);
router.get('/assigned/:name', protectRoute(['user']), needController.getAssignedNeeds);
router.post('/need', protectRoute(['user']), needController.createNeed);
router.put('/need/:id', protectRoute(['user']), needController.updateNeed);
router.delete('/needs/:id', protectRoute(['user']), needController.deleteNeed);
router.put('/need/:id/status', protectRoute(['user']), needController.changeNeedStatus);
// User routes
router.get('/profile/:name', protectRoute(['user']), userController.getUserProfile);
router.put('/profile', protectRoute(['user']), userController.updateUserProfile);
router.get('/users', protectRoute(['user']), userController.getAllUsers);
router.get('/user/:id', protectRoute(['user']), userController.getUser);
router.delete('/user/:id', protectRoute(['user']), userController.deleteUser);
router.put('/users/:id/:blockStatus', protectRoute(['user']), userController.blockorUnBlockUser);


// Message routes
router.get('/messages/:needID', protectRoute(['user']), messageController.getMessagesByNeed);
router.get('/messages/:userId1/:userId2', protectRoute(['user']), messageController.getConversation);

// Report routes
router.get('/reports/:username', protectRoute(['user']), reportController.getReportsByUsername);
router.post('/report', protectRoute(['user']), reportController.createReport);

module.exports = router;