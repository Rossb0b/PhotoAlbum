const express = require('express');

const extractFiles = require('../middlewares/photosAlbum');
const extractFile = require('../middlewares/photoAlbum');
const checkAuth = require('../middlewares/check-auth');
const AlbumController = require('../controllers/albums');

const router = express.Router();


router.post("", checkAuth, extractFiles, AlbumController.createAlbum);

router.put("/:id", checkAuth, extractFile, AlbumController.editAlbum);

router.get("", AlbumController.getAlbums);

router.get("/:id", AlbumController.getAlbum);

router.delete("/:id", checkAuth, AlbumController.deleteAlbum);

module.exports = router;
