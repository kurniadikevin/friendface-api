var express = require('express');
var router = express.Router();



// get all image
router.get('/',images_controller.get_all_image);


//upload new image
router.post('/',middelware_controller.verifyToken,images_controller.post_upload_image);

//get user profileImage by email
router.post('/:email',middelware_controller.verifyToken,images_controller.get_user_profileImage);


module.exports = router;