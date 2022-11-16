var express = require('express');
var passport = require('passport')
var router = express.Router();
const users_controller= require('../controllers/usersCont');

/* GET users listing. */
router.get('/', users_controller.get_user_all);

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

// facebook auth router
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
    "/auth/facebook/callback",
    passport.authenticate("facebook", {
       successRedirect: "/success",
      failureRedirect: "/fail" 
      
    })
  );

  router.get("/fail", (req, res) => {
    res.send("Failed attempt");
  });
  
  router.get("/success", (req, res) => {
    res.send("Success");
  });



module.exports = router;
