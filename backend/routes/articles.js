const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const checkArticleExistance = require('../middlewares/article/check-articleDosntExistOnAlbum');
const ArticleController = require('../controllers/articles');

const router = express.Router();


router.post("", checkAuth, checkArticleExistance, ArticleController.createArticle);

router.put("/:id", checkAuth, ArticleController.editArticle);

router.get("", ArticleController.getArticle);

router.delete("/:id", checkAuth, ArticleController.deleteArticle);

module.exports = router;
