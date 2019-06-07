const express = require('express');

const extractFile = require('../middlewares/avatar');
const checkAuth = require('../middlewares/check-auth');
const UserController = require('../controllers/user');

const router = express.Router();

router.post("/signup", extractFile, UserController.createUser);

router.post("/login", UserController.userLogin);

router.get("/:id", checkAuth,UserController.getUser);

router.get("", UserController.getUsers);

router.put("/:id", checkAuth, extractFile, UserController.editUser);

module.exports = router;
