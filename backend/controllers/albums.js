const Album = require('../models/album');
const Article = require('../models/article');
const fs = require('fs');


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
        /** debugging */
        console.error(e);
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

  // console.log(req.body);
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
  // console.log(images);

  if(req.body.onAdd === 'true') {
    images.forEach(image => {
      // console.log(image);
      formatedArrayOfFile.push(image);
    });
    // console.log(req.file);
    if(req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/photos/" + req.file.filename;
      imageAlt = '-Image-' + req.file.filename;
      const image = {path: imagePath, alt: imageAlt};
      // console.log(image);
      if(formatedArrayOfFile.length <= 12) {
        formatedArrayOfFile.push(image);
      } else {
        res.status(403).json({ message: 'You can\'t upload more than 12 photos per album'});
      }
    }
    album = new Album({
      _id: req.body._id,
      title: req.body.title,
      images: formatedArrayOfFile,
      creator: req.body.creator
    });
    // console.log(album);
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
    album = new Album({
    _id: req.body._id,
    title: req.body.title,
    images: formatedArrayOfFile,
    creator: req.body.creator
    });
  }

  // handle  title modification add new friends in list
  if(!req.body.imageToDeletePath && !req.body.onAdd && req.body.title.length >= 4 && req.body.title.length <= 18) {
    album = new Album({
      _id: req.body._id,
      title: req.body.title,
      images: images,
      creator: req.body.creator,
      linked_friendsId: req.body.linked_friendsId,
      created_date: req.body.created_date
    });
    album.validate(function(error) {
      if(error) {
          res.status(500).json({ message: 'One or many ID share are not existing in our database' });
      }
      else {
        Album.update({_id: req.body._id, creator: req.userData.userId}, album).then(result => {
          if(result.n > 0) {
            res.status(200).json({ message: 'update successfull' });
          } else {
            res.status(401).json({ message: 'Not authorized' });
          }
        }).catch(error => {
          res.status(500).json({ message: 'Couldn\'t update post'});
        });
      }
    });
  } else {
    Album.updateOne({_id: req.body._id, creator: req.userData.userId}, album).then(result => {
      if(result.n > 0) {
      res.status(200).json({ message: 'update successfull' });
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  })
  .catch(error => {
    res.status(500).json({ message: 'Couldn\'t update post'});
  });
}
};

exports.getAlbums = async (req, res, next) => {
  try {
    await Album.find({ $or:[{ creator: req.query.userId }, { linked_friendsId: { "$in" : [req.query.userId] } }] })
      .then(albums => {
        res.status(200).json({
          message: 'Albums fetched seccessfully ! ',
          albums: albums,
        });
      });
  } catch (e) {
    /** debugging */
    console.error(e);
    res.status(500).json({ message: 'Fetching albums failed' });
  }
};

exports.getAlbum = (req, res, next) => {
  Album.findById(req.params.id).then(album => {
    if (album) {
      res.status(200).json(album);
    } else {
      res.status(404).json({message: "album not find"});
    }
  })
  .catch(error => {
    res.status(500).json({ message: 'Fetching album failed'});
  });
};


exports.deleteAlbum = async (req, res, next) => {
  try {
    Album.findOneAndDelete({ _id: req.params.id }).then(result => {
      if (result) {
        deleteArticleForThisAlbum(result._id);
        result.images.forEach(photo => {
          deletePhoto(photo);
        });
      }
    }).then(() => {
      res.status(200).json({ message: 'deletion successfull' });
    });
  } catch (e) {
    /** debugging */
    console.error(e);
    res.status(401).json({ message: 'Not authorized' });
  }
};

deletePhoto = async (photo) => {
  let imageToDeleteFractionnalPath = photo.path.split("photos/").pop();
  let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/photos/" + imageToDeleteFractionnalPath;
  let promise = new Promise((resolve, reject) => {
    setTimeout(() => resolve(fs.unlink(imageToDeleteFinalPath, function(error) {
      console.error(error);
    })), 1000);
  });

  let result = await promise; // wait till the promise resolves (*)
};

deleteArticleForThisAlbum = async (albumId) => {
  try {
    Article.findOneAndDelete({ albumId: albumId }).then(() => {
      return status(200).json({ message: 'article has been deleted aswell' });
    });
  } catch (e) {
    /** debugging */
    console.error(e);
  }
};
