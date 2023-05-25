var express = require('express');
var router = express.Router();
const message_controller = require('../controllers/messageCont');
const middelware_controller= require('../controllers/middleware');


//GET message list all
router.get('/all',message_controller.message_list_all);

//GET message by Id
router.get('/byId/:messageId',message_controller.message_byId);

//POST create new message
router.post('/new/:chatRoomId',middelware_controller.verifyToken,message_controller.create_new_message, message_controller.push_notification_message);

//POST create message notification
router.post('/test/:chatRoomId',middelware_controller.verifyToken, message_controller.push_notification_message);

module.exports = router;