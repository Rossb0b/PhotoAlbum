const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

const User = require('../models/user');

/**
 * Async method to create a new User.
 * Init the user send by the request.
 * Define the default avatar for the user.
 *
 * @returns {json{message<string>, result<User> if success}}
 */
exports.createUser = async (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");
  const user = new User(req.body);
  user.imagePath = url + '/images/avatars/default.png';

  try {
    user.password = await hashPassword(req.body.password);
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

/**
 * Encrypt the password.
 */
hashPassword = (password) => {
  return bcrypt.hash(password, 10);
};

/**
 * Async method to connect a User.
 * First check that the user exist.
 * Uncrypt and compare the password.
 * Create a new token with user data, the JWT key, and the delay before it connexion expires.
 *
 * @returns {json{message<string> || message<string>, token, expiresIn<number>, userId<string>}}
 */
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

    const token = jwtSign({ email: user.email, userId: user._id });

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

/**
 * Create a new token of connexion for the identified user.
 */
jwtSign = ({ email, userId }) => {
  return jwt.sign(
    { email: email, userId: userId },
    process.env.JWT_KEY,
    { expiresIn: '1h' },
  );
};

/**
 * Async method to get the wanted User.
 *
 * @returns {json{user<User> || message<string>}}
 */
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

/**
 * Async method to get every User.
 *
 * @returns {json{users<User[]> || message<string>}}
 */
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

/**
 * Async method to edit an User.
 * Get the old avatar to delete it.
 * Get the new avatar to store it.
 * Init the new user send by the request.
 * After success of editing, delete the old avatar in local (if not the default one).
 *
 * @returns {json{message<string>}}
 */
exports.editUser = async (req, res, next) => {

  let imageToDelete = req.body.imagePath;
  var imageToDeleteFractionnalPath = imageToDelete.split("avatars/").pop();
  let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/avatars/" + imageToDeleteFractionnalPath;
  imagePath = req.body.imagePath;

  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/avatars/" + req.file.filename;
  }

  if (user._id === req.params.id) {

    const user = new User (req.body);
    user._id = req.body.id;
    user.imagePath = imagePath;

    try {
      const result = await User.updateOne({
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
      console.log(e);
      res.status(401).json({
        message: 'Update failed'
      });
    }
  } else {
    res.status(401).json({
      message: 'You cannot modify the profile of someone else'
    });
  }
};
