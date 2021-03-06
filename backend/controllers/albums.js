const Album = require('../models/album');
const Article = require('../models/article');
const User = require('../models/user');
const fs = require('fs');

/**
 * Async method that create an Album.
 * First, for each file of http request, we define a new image pushed into an array of formatted image,
 * For this, we define a path and an alt depending of the filename.
 * Then we ensure that the new album that we want to create is valid before saving it.
 *
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
    const album = new Album({
      title: req.body.title,
      images: formatedArrayOfFile,
      sharedUsers: [],
      userId: req.userData.userId,
    });

    /** checking that we got a valid album, that he respects Album's model */
    album.validate(async (error) => {

      if(error) {
          res.status(500).json({
            message: 'not valid album',
            error: error,
          });
      } else {
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

    });
  } else {
    res.status(204).json({
      message: 'Req without expected content'
    });
  }
};

/**
 * Async method to edit an Album.
 * First, we get the images of the album before editing.
 * We look for changes that user wants and play with array of images if needed.
 * Then we ensure that the new album that we want to create is valid before saving it.
 *
 * @returns {json({message<string>})}
 */
exports.editAlbum = (req, res, next) => {

  const formatedArrayOfFile = [];
  let images = [];

  album = new Album(req.body);

  if (req.body.imagesPath) {
    for (let i = 0; i < req.body.imagesPath.length; i++) {
      const image = { path: req.body.imagesPath[i], alt: req.body.imagesAlt[i] };
      images.push(image);
    }
  } else {
    images = req.body.images;
  }

  // Checking if the user is editing the album by adding a simple image to this last one.
  if (req.body.onAdd === 'true') {
    images.forEach(image => {
      formatedArrayOfFile.push(image);
    });

    // Checking that their is effectivly a file in the http request.
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      const imagePath = url + "/images/photos/" + req.file.filename;
      const imageAlt = '-Image-' + req.file.filename;
      const image = {path: imagePath, alt: imageAlt};

      // Checking length of the array of file for the album.
      // Albumms can't get more than two images.
      if (formatedArrayOfFile.length <= 12) {
        formatedArrayOfFile.push(image);
      } else {
        res.status(403).json({
          message: 'You can\'t upload more than 12 photos per album'
        });
      }
    }

    album.images = formatedArrayOfFile;
  }

  // Manipulate Data in case of deleting single image request
  // First check if the request's body holds imageToDeletePath const
  if(req.body.imageToDeletePath) {
    /** Then do some fancy stuff */
    let imageToDeleteFractionnalPath = req.body.imageToDeletePath.split("photos/").pop();
    let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/photos/" + imageToDeleteFractionnalPath;

    /** Delete this image with synchrone function from fs library */
    fs.unlinkSync(imageToDeleteFinalPath);

    images.forEach(image => {
      if (image.path !== req.body.imageToDeletePath) {
        formatedArrayOfFile.push(image);
      }
    });

    album.images = formatedArrayOfFile;
  }

  /** Checking that we got a valid album, that he respects Album's model */
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
          _id: album._id,
          userId: req.userData.userId
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
          message: 'Couldn\'t update album'
        });
      }
    }

  });

};

/**
 * Async methods to get every album for this user.
 *
 * @returns {json({message<string>, albums<Album[]> if success})}
 */
exports.getAlbums = async (req, res, next) => {
  try {
    /** Find albums where userId = connected userID, or, where connected userID is in sharedUsers array */
    const albums = await Album.find({
      $or:[
        { userId: req.query.userId },
        { sharedUsers: {
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
 * Async method to get the wanted album and the user linked to this album.
 *
 *
 * @returns {json({album<Album>, users<User[]>})}
 */
exports.getAlbum = async (req, res, next) => {
  try {
    const album = await Album.findById(req.params.id);
    const users = await findUsersShareWithThisAlbum(album.sharedUsers);
    res.status(200).json({
      album: album,
      users: users
    });
  } catch (e) {
    res.status(500).json({
      message: 'Fetching album failed'
    });
  }
};


/**
 * Async method that find every user shared with the identified album
 *
 * @returns {json({message<string>})}
 */
findUsersShareWithThisAlbum = async (friendsId) => {
  try {
    return await User.find({
      "_id": {
        "$in": friendsId,
      }
    });
  } catch (e) {
    res.status(500).json({
      message: 'Cannot fetch users',
    });
  }
};

/**
 * Async method that delete an album and the article linked to it if exist.
 *
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
 *
 * @param {string} photo
 */
deletePhoto = async (photo) => {
  let imageToDeleteFractionnalPath = photo.path.split("photos/").pop();
  let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/photos/" + imageToDeleteFractionnalPath;

  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(fs.unlink(imageToDeleteFinalPath, function(error) {
      if (error) {
        console.log(error);
      }
    })), 1000);
  });

  let result = await promise; // wait till the promise resolves (*)
};


/**
 * Async method that delete Article linked to album if exist.
 *
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
