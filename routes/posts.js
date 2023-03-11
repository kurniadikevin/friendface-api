var express = require('express');
var router = express.Router();
const posts_controller = require('../controllers/postsCont') 

/* GET all post */
router.get('/',posts_controller.post_list);

// get all post with paganation
router.get('/page/:pageNumber',posts_controller.post_list_page);

//get all friend post
router.get('/friends/:userId',posts_controller.post_list_friends)

//create new post
router.post('/newpost',posts_controller.create_new_post);

//get  profile user post
router.get('/:userId', posts_controller.user_post_list);

// post like post
router.post('/likes/:postId',posts_controller.update_post_likes); 

module.exports = router;
