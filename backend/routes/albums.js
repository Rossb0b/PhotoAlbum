const express = require('express');

const checkAuth = require('../middlewares/check-auth');
const checkAlbum = require('../middlewares/album/check-albumNumber');
const extractFiles = require('../middlewares/album/save-photosAlbum');
const extractFile = require('../middlewares/album/save-photoAlbum');
const AlbumController = require('../controllers/albums');

const router = express.Router();


router.post("", checkAuth, checkAlbum, extractFiles, AlbumController.createAlbum);

router.put("/:id", checkAuth, extractFile, AlbumController.editAlbum);

router.get("", AlbumController.getAlbums);

router.get("/:id", AlbumController.getAlbum);

router.delete("/:id", checkAuth, AlbumController.deleteAlbum);

module.exports = router;
