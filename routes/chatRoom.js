var express = require('express');
var router = express.Router();
const chatRoom_controller = require('../controllers/chatRoomCont') ;

//GET chatroom list all
router.get('/all',chatRoom_controller.chat_room_list_all);

//GET chatroom by Id
router.get('/byId/:chatRoomId',chatRoom_controller.chat_room_byId);

// POST create new private chat room
router.post('/createPrivate/:userId', chatRoom_controller.create_new_private_chat_room);

//POST create new group chat room
router.post('/createGroup', chatRoom_controller.create_new_group_chat_room);

module.exports = router;