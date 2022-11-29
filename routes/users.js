var express = require('express');
var passport = require('passport')
var router = express.Router();
const users_controller= require('../controllers/usersCont');

/* GET users listing. */
router.get('/', users_controller.get_user_all);

//get user for query
router.get('/search/',users_controller.get_user_search_data);

//test
router.get('/recent',users_controller.get_new_user);

//POST create new user
router.post('/signup',users_controller.post_new_user);

// GET user detail
router.get('/:userId', users_controller.get_user_detail);


//PUT update user username
router.post('/update/:userId',users_controller.put_update_username)

//PUT update user profilePicure
router.post('/update/profilePicture/:userId',users_controller.put_update_user_profilePicture);

//POST make friend request
router.post('/friendRequest/:userId',users_controller.post_user_friend_request);

//POST accept friend request
router.post('/friendRequest/accept/:userId',users_controller.post_accept_friend_request);

//POST decline friend request
router.post('/friendRequest/decline/:userId',users_controller.post_decline_friend_request);


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


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}


module.exports = router;
