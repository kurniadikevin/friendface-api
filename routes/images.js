var express = require('express');
var router = express.Router();
const images_controller = require('../controllers/imagesCont') ;

// get all image
router.get('/',images_controller.get_all_image);


//upload new image
router.post('/',images_controller.post_upload_image);

module.exports = router;