var express = require('express');
var router = express.Router();
const posts_controller = require('../controllers/postsCont') 

/* GET all post */
router.get('/',posts_controller.post_list);

//create new post
router.post('/newpost',posts_controller.create_new_post);

/* router.get('/newpost',(req,res)=>{
    res.send(req.user)
}) */

module.exports = router;
