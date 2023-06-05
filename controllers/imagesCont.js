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

  // limit file size too 500kb
  const limits= {fileSize : 0.5 * 1024 * 1024}

  var upload = multer({ storage: storage, limits: limits ,fileFilter: function(_req, file, cb){
    checkFileType(file, cb);
    }});

function checkFileType(file, cb){
  // Allowed ext file images
  const filetypes = /jpeg|jpg|png|gif|ico/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);
  if(mimetype && extname){
    return cb(null, true);
  } else {
    return cb(null, false);
  }
}

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
             res.redirect('https://friendface.vercel.app/profile');
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