var express = require('express');
var router = express.Router();
const userChat_controller = require('../controllers/userChatCont');

//GET all userChat
router.get('/all',userChat_controller.find_user_chat_all)

//GET userChat by Id
router.get('/byId/:userId',userChat_controller.find_user_chat_by_userId);

// POST create userChat
router.post('/create/:userId',userChat_controller.create_user_chat);


module.exports = router;