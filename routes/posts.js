var express = require('express');
var router = express.Router();
const posts_controller = require('../controllers/postsCont') 

/* GET users listing. */
router.get('/',posts_controller.post_list);

module.exports = router;
