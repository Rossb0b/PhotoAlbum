const express = require('express');

const extractFile = require('../middlewares/avatar');
const checkAuth = require('../middlewares/check-auth');
const PostController = require('../controllers/posts');

const router = express.Router();


router.post("", checkAuth, extractFile, PostController.createPost);

router.put("/:id", checkAuth, extractFile, PostController.editPost);

router.get("", PostController.getPosts);

router.get("/:id", PostController.getPost);

router.delete("/:id", checkAuth, PostController.deletePost);

module.exports = router;
