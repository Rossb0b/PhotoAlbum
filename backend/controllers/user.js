const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/user');

exports.createUser = async (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");

  hashPassword(req.body.password, hash => {
    const user = new User(req.body);
    user.password = hash;
    user.imagePath = url +"/images/avatars/default.png";
  });

  try {
    const result = await user.save();
    res.status(201).json({
      message: 'User created',
      result: result
    });
  } catch (e) {
    res.status(500).json({
      message: 'Invalid authentification credendials',
    });
  }
};

hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

exports.userLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({
      email: req.body.email
    });

    if(!user) {
      return res.status(401).json({
          message: 'Auth failed'
      });
    }

    const result = bcrypt.compare(req.body.password, user.password);

    if (!result) {
      return res.status(401).json({
          message: 'Auth failed, wrong password'
      });
    }

    const token = jwtSign(user);
    console.log(token);

    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: user._id
    });
  } catch (e) {
    console.log(e);
    res.status(401).json({
      message: 'Invalid authentification credentials!', e: e
    });
  }
};

jwtSign = ({ email, userId }) => {
  return jwt.sign(
    { email: email, userId: userId },
    process.env.JWT_KEY,
    { expiresIn: '1h' },
  );
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (e) {
    res.status(401).json({
      message: 'Fetching user failed', e
    });
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (e) {
    console.log(e);
    res.status(401).json({
      message: 'Fetching users failed',
    });
  }
};

exports.editUser = async (req, res, next) => {
  let imageToDelete = req.body.imagePath;
  var imageToDeleteFractionnalPath = imageToDelete.split("avatars/").pop();
  let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/avatars/" + imageToDeleteFractionnalPath;
  imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/avatars/" + req.file.filename;
  }

  const user = new User (req.body);
  user.imagePath = imagePath;

  try {
    const result = User.updateOne({
      _id: req.params.id,
    }, user);

    if (result.n > 0) {
      if (imageToDeleteFinalPath !== "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/avatars/default.png") {
        /** Delete the image with synchron function after removing the album successfully */
        fs.unlinkSync(imageToDeleteFinalPath);
      }
      res.status(200).json({
        message: 'update successfull'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized'
    });
    }
  } catch (e) {
    res.status(401).json({
      message: 'Update failed'
  });
  }
};


