const imgModel = require('../models/images');
const multer = require('multer');
var fs = require('fs');
var path = require('path');


/* <-----------multer for image management-----------------> */
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now())
    }
  });

  var upload = multer({ storage: storage });


exports.get_all_image=(req, res) => {
  imgModel.find({}, (err, items) => {
      if (err) {
          console.log(err);
          res.status(500).send('An error occurred', err);
      }
      else {
          res.render('imagesPage', { items: items });
      }
  });
}

exports.post_upload_image = (upload.single('image'), (req, res, next) => {
    var obj = {
        byUser : req.body.byUser,
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
             //item.save();
             res.redirect('https://odin-book-api-production.up.railway.app/profile');
        }
    });
  })

exports.get_user_profileImage = (req, res) => {
    imgModel.find({ byUser : req.params.email}
      , (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred', err);
        }
         {
           res.json(
            (items[items.length-1]).img.data.toString('base64')
           )
           //res.render('imagesPage', { items: items });
        }
    });
  };