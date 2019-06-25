const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const CommentController = require('../controllers/comments');

const router = express.Router();


router.post("", checkAuth, CommentController.createComment);

// router.put("/:id", checkAuth, CommentController.editComment);

router.get("", checkAuth, CommentController.getCommentsForThisArticle);

router.delete("/:id", checkAuth, CommentController.deleteComment);

module.exports = router;
