var express = require('express');
var router = express.Router();
const userChat_controller = require('../controllers/userChatCont');

//GET all userChat
router.get('/all',userChat_controller.find_user_chat_all);

//GET userChat by userChatId
router.get('/byUserChatId/:userChatId',userChat_controller.find_user_chat_by_userChatId);

//GET userChat by userId
router.get('/byUserId/:userId',userChat_controller.find_user_chat_by_userId);

// POST create userChat
router.post('/create/:userId',userChat_controller.populate_userchat_chatRoomList,userChat_controller.create_user_chat);



//test
/* router.get('/test/:userId',userChat_controller.populate_userchat_chatRoomList); */

module.exports = router;