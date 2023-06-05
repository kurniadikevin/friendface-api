var express = require('express');
var passport = require('passport')
var router = express.Router();
const users_controller= require('../controllers/usersCont');
const middelware_controller= require('../controllers/middleware');


/* GET users listing. */
router.get('/', users_controller.get_user_all);

//get user for query
router.get('/search',users_controller.get_user_search_data);

//GET top 5 newly created user
router.get('/recent',users_controller.get_new_user);

//GET user by top 5 friends count
router.get('/popular',users_controller.get_popular_user);

// GET user detail
router.get('/:userId', users_controller.get_user_detail);

// GET user detail
router.get('/simplified/:userId', users_controller.get_user_detail_simplified);

//GET user profile picture with Id parameter input
router.get('/profilePicture/:userId', users_controller.get_user_profile_picture_byId);

//POST create new user
router.post('/signup',users_controller.post_new_user);

//POSTT update user username
router.post('/update/:userId',middelware_controller.verifyToken,users_controller.put_update_username)

//PUT update user profilePicure
router.post('/update/profilePicture/:userId',middelware_controller.verifyToken,users_controller.put_update_user_profilePicture);

//POST make friend request
router.post('/friendRequest/:userId',middelware_controller.verifyToken,users_controller.post_user_friend_request);

//POST accept friend request
router.post('/friendRequest/accept/:userId',middelware_controller.verifyToken,users_controller.post_accept_friend_request);

//POST decline friend request
router.post('/friendRequest/decline/:userId',middelware_controller.verifyToken,users_controller.post_decline_friend_request);

//POST clear notification unseen
router.post('/seenNotification/:userId',middelware_controller.verifyToken,users_controller.post_seenAt_notification_update);

//POST clear friendRequest notif unseen
<<<<<<< HEAD
router.post('/seenFriendReqNotif/:userId',users_controller.friendRequest_seenAt_notification_update);


  /* <------------------------FACEBOOK AUTHENTICATION ------------------> */
router.get('/fb/profile', isLoggedIn, function (req, res) {
  res.send(req.user)
});

router.get('/fb/error', isLoggedIn, function (req, res) {
  res.send('pages/error');
});

router.get('/auth/facebook', passport.authenticate('facebook', {
  scope:['password', 'email']
}));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: 'https://friendface.vercel.app/',
    failureRedirect: '/error'
  }));

router.get('/fb/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});
=======
router.post('/seenFriendReqNotif/:userId',middelware_controller.verifyToken,users_controller.friendRequest_seenAt_notification_update);
>>>>>>> localdev-bearer




module.exports = router;
