const Album = require('../models/album');
const Article = require('../models/article');
const fs = require('fs');

/**
 * @returns {json({message<string>, album<Album> if success})}
 */
exports.createAlbum = async (req, res, next) => {
  const formatedArrayOfFile = [];
  const url = req.protocol + '://' + req.get("host");

  req.files.forEach(file => {
    imagePath = url + '/images/photos/' + file.filename;
    imageAlt = '-Image-' + file.filename;
    let image = {path: imagePath, alt: imageAlt};
    formatedArrayOfFile.push(image);
  });

  if (req.body.title) {
    if (req.body.title.length < 4 || req.body.title.length > 18 ) {
      res.status(406).json({
        message: 'Your title must have 4 caracters at least and less than 18.'
      });
    } else {
      const album = new Album({
        title: req.body.title,
        images: formatedArrayOfFile,
        linked_friendsId: [],
        creator: req.userData.userId,
      });

      try {
        await album.save().then(createdAlbum => {
          res.status(201).json({
              message: 'Album added successfully',
              album: {
                ...createdAlbum,
                id: createdAlbum._id
              }
          });
        });
      } catch (e) {
        res.status(500).json({
            message: 'Creating an Album failed'
        });
      }
    }
  } else {
    res.status(204).json({
      message: 'Req without expected content'
    });
  }
};


exports.editAlbum = (req, res, next) => {

  const formatedArrayOfFile = [];
  let images = [];

  if (req.body.imagesPath) {
    for (let i = 0; i < req.body.imagesPath.length; i++) {
      const image = { path: req.body.imagesPath[i], alt: req.body.imagesAlt[i] };
      images.push(image);
    }
  } else {
    images = req.body.images;
  }

  if(req.body.onAdd === 'true') {
    images.forEach(image => {
      formatedArrayOfFile.push(image);
    });

    if(req.file) {
      const url = req.protocol + "://" + req.get("host");
      const imagePath = url + "/images/photos/" + req.file.filename;
      const imageAlt = '-Image-' + req.file.filename;
      const image = {path: imagePath, alt: imageAlt};

      if(formatedArrayOfFile.length <= 12) {
        formatedArrayOfFile.push(image);
      } else {
        res.status(403).json({
          message: 'You can\'t upload more than 12 photos per album'
        });
      }
    }

    album = new Album(req.body);
    album.images = formatedArrayOfFile;
  }

  // Manipulate Data in case of deleting single image request
  // First check if the request's body holds imageToDeletePath const
  if(req.body.imageToDeletePath) {
    // Then do some fancy stuff
    let imageToDeleteFractionnalPath = req.body.imageToDeletePath.split("photos/").pop();
    let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/photos/" + imageToDeleteFractionnalPath;

    fs.unlinkSync(imageToDeleteFinalPath);

    images.forEach(image => {
      if (image.path !== req.body.imageToDeletePath) {
        formatedArrayOfFile.push(image);
      }
    });

    album = new Album(req.body);
    album.images = formatedArrayOfFile;
  }

  // handle  title modification add new friends in list
  if(!req.body.imageToDeletePath && !req.body.onAdd && req.body.title.length >= 4 && req.body.title.length <= 18) {
    album = new Album(req.body);
  }

  album.validate(async (error) => {
    if(error) {
        res.status(500).json({
          message: 'not valid album',
          error: error,
        });
    }
    else {
      try {
        let result = await Album.updateOne({
          _id: req.body._id,
          creator: req.userData.userId
        }, album);

        if (result.n > 0) {
          res.status(200).json({
            message: 'update successfull'
          });
        } else {
          res.status(401).json({
            message: 'Not authorized'
          });
        }
      } catch (e) {
        res.status(500).json({
          message: 'Couldn\'t update post'
        });
      }
    }
  });

};

/**
 * @returns {json({message<string>, albums<Album[]> if success})}
 */
exports.getAlbums = async (req, res, next) => {
  try {
    const albums = await Album.find({
      $or:[
        { creator: req.query.userId },
        { linked_friendsId: {
          "$in" : [req.query.userId]
          }
        },
      ]
    });
    res.status(200).json({
      message: 'Albums successfully fetched',
      albums: albums
    });
  } catch (e) {
    res.status(500).json({
      message: 'Fetching albums failed'
    });
  }
};

/**
 * @returns {json({album<Album>})}
 */
exports.getAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);
    res.status(200).json(album);
  } catch (e) {
    res.status(500).json({
      message: 'Fetching album failed'
    });
  }
};

/**
 * @returns {json({messsage<string>})}
 */
exports.deleteAlbum = async (req, res, next) => {
  try {
    const result = await Album.findOneAndDelete({
      _id: req.params.id
    });

    deleteArticleForThisAlbum(result._id);

    result.images.forEach(photo => {
      deletePhoto(photo);
    });

    res.status(200).json({
      message: 'deletion successfull'
    });
  } catch (e) {
    res.status(401).json({
      message: 'Not authorized'
    });
  }
};

/**
 * Async method that delete a photo.
 * @param {string} photo
 */
deletePhoto = async (photo) => {
  let imageToDeleteFractionnalPath = photo.path.split("photos/").pop();
  let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/photos/" + imageToDeleteFractionnalPath;

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(fs.unlink(imageToDeleteFinalPath, function(error) {
      console.log(error);
    })), 1000);
  });

  let result = await promise; // wait till the promise resolves (*)
};


/**
 * Async method that delete Article linked to album if exist.
 * @param {string} albumId
 */
deleteArticleForThisAlbum = async (albumId) => {
  try {
    await Article.findOneAndDelete({
      albumId: albumId
    });
  } catch (e) {
    res.status(500).json({
      message: 'Album cannot be delete'
  });
  }
};
