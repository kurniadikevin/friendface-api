var express = require('express');
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
router.post('/update/profilePicture/:userId',users_controller.put_update_user_profilePicture)

module.exports = router;
