const express = require('express');
const router = express.Router();
const protectRoute = require('../middleware/auth');
const needController = require('../controller/needController');
const userController = require('../controller/userController');
const messageController = require('../controller/messageController');
const reportController = require('../controller/reportController');

// Need routes
router.get('/needs', needController.getAllNeeds);
router.get('/needs/:name', needController.getUserNeeds);
router.put('/need/:id', needController.updateNeed);
router.delete('/needs/:id', needController.deleteNeed);
router.put('/need/:id/status', needController.changeNeedStatus);
// User routes
router.get('/users', userController.getAllUsers);
router.get('/user/:id', userController.getUser);
router.delete('/user/:id', userController.deleteUser);
router.put('/users/:id/:blockStatus', userController.blockorUnBlockUser);


// Message routes
router.get('/messages/:needID', messageController.getMessagesByNeed);
router.get('/messages/:userId1/:userId2', messageController.getConversation);

// Report routes
router.get('/reports/:username', reportController.getReportsByUsername);
router.post('/report', reportController.createReport);
router.get('/reports', reportController.getAllReports);
module.exports = router;