var express = require('express');
var router = express.Router();
const users_controller= require('../controllers/usersCont');

/* GET users listing. */
router.get('/', users_controller.get_user_all);

//test
router.get('/test',(req,res)=>{
  res.send('test page')
  
})

//POST create new user
router.post('/signup',users_controller.post_new_user);


module.exports = router;
