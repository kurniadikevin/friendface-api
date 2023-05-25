var express = require('express');
var router = express.Router();
const chatRoom_controller = require('../controllers/chatRoomCont') ;
const middelware_controller= require('../controllers/middleware');


//GET chatroom list all
router.get('/all',chatRoom_controller.find_chat_room_list_all);

//GET chatroom by Id
router.get('/byId/:chatRoomId',chatRoom_controller.find_chat_room_byId);

// POST create new private chat room
router.post('/createPrivate/:userId', middelware_controller.verifyToken,chatRoom_controller.create_new_private_chat_room);

//POST create new group chat room
router.post('/createGroup',middelware_controller.verifyToken, chatRoom_controller.create_new_group_chat_room);

//POST seeing message clear notification
router.post('/seen/:chatRoomId',middelware_controller.verifyToken, chatRoom_controller.seen_messages_notification_chat_room);

module.exports = router;