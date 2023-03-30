var express = require('express');
var router = express.Router();
const message_controller = require('../controllers/messageCont') ;

//GET message list all
router.get('/all',message_controller.message_list_all);

//GET message by Id
router.get('/byId/:messageId',message_controller.message_byId);

//POST create new message
router.post('/new/:chatRoomId',message_controller.create_new_message);


module.exports = router;