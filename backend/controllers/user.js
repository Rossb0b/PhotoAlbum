const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  bcrypt.hash(req.body.password, 10)
      .then(hash => {
          const user = new User({
              email: req.body.email,
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              password: hash,
              imagePath: url + "/images/avatars/default.png",
          });
          user.save()
              .then(result => {
                  res.status(201).json({
                      message: 'User created',
                      result: result
                  });
              })
              .catch(err => {
                  res.status(500).json({
                      message: 'Invalid authentification credendials'
                  });
              });
      });
}

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({email: req.body.email})
      .then(user => {
          if(!user) {
              return res.status(401).json({
                  message: 'Auth failed'
              });
          }
          fetchedUser = user;
          return bcrypt.compare(req.body.password, user.password)
      })
      .then(result => {
          if (!result) {
              return res.status(401).json({
                  message: 'Auth failed'
              });
          }
          const token = jwt.sign(
            { email: fetchedUser.email, userId: fetchedUser._id },
            process.env.JWT_KEY,
            { expiresIn: '1h'}
          );
          res.status(200).json({
              token: token,
              expiresIn: 3600,
              userId: fetchedUser._id
          });
      })
      .catch(err => {
          return res.status(401).json({
              message: 'Invalid authentification credentials!'
          });
      })
}

exports.getUser = (req, res, next) => {
  User.findById(req.params.id).then(user => {
    if(User) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'User not find' })
    }
  })
  .catch(error => {
    res.status(401).json({ message: 'Fetching user failed' })
  })
}

exports.getUsers = (req,res, next) => {
  User.find().then(users => {
    if(users) {
      res.status(200).json(users);
    } else {
      res.status(401).json({ message: 'No user find' });
    }
  })
  .catch(error => {
    res.status(401).json({ message: 'Fetching users failed'});
  })
}

exports.editUser = (req, res, next) => {
  let imageToDelete = req.body.imagePath;
  var imageToDeleteFractionnalPath = imageToDelete.split("avatars/").pop();
  let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/avatars/" + imageToDeleteFractionnalPath;
  console.log(imageToDeleteFinalPath);
  imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/avatars/" + req.file.filename;
  }
  const user = new User ({
    _id: req.body.id,
    email: req.body.email,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    imagePath: imagePath
  });
  User.updateOne({_id: req.params.id}, user).then(result => {
    if(result.n > 0) {
      if(imageToDeleteFinalPath !== "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/avatars/default.png") {
        fs.unlinkSync(imageToDeleteFinalPath);
      }
      res.status(200).json({ message: 'update successfull' });
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  })
  .catch(error => {
    res.status(401).json({message: 'Update failed'});
  })
}


