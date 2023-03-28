var express = require('express');
var router = express.Router();
const posts_controller = require('../controllers/postsCont');

// get all post
router.get('/',posts_controller.post_list);

//get post detail
router.get('/:postId',posts_controller.post_detail_byId);

// get all post with paganation
router.get('/page/:pageNumber',posts_controller.post_list_page);

//get all friend post
router.get('/friends/:userId',posts_controller.post_list_friends);

//get all friend post with paganation
router.get('/friends/:userId/page/:pageNumber',posts_controller.post_list_friends_page);

//create new post
router.post('/newpost',posts_controller.create_new_post);

//get  profile user post
router.get('/:userId', posts_controller.user_post_list);

//get profile user post count
router.get('/:userId/count',posts_controller.user_post_count);

//get  profile user post with paganation
router.get('/:userId/page/:pageNumber', posts_controller.user_post_list_page);

// post like post
router.post('/likes/:postId',posts_controller.update_post_likes, posts_controller.push_notification_like); 


module.exports = router;
