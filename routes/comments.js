var express = require('express');
var router = express.Router();
const comment_controller = require('../controllers/commentCont') ;

//GET all comment on post
//router.get('/comment/:postId',comment_controller );

//POST new comment on post with push notification
router.post('/createComment/:postId', comment_controller.create_new_comment, comment_controller.push_notification_comment);

module.exports = router;