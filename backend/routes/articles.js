const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const ArticleController = require('../controllers/articles');

const router = express.Router();


router.post("", checkAuth, ArticleController.createArticle);

// router.put("/:id", checkAuth, extractFile, AlbumController.editAlbum);

// router.get("", AlbumController.getAlbums);

router.get("/:albumId", ArticleController.getArticle);

// router.delete("/:id", checkAuth, AlbumController.deleteAlbum);

module.exports = router;
