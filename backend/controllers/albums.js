const Album = require('../models/album');
const fs = require('fs');


exports.createAlbum = (req, res, next) => {
  const formatedArrayOfFile = [];
  Album.countDocuments({creator: req.userData.userId}, function(err, count) {
    //handle possible errors
    if (err) {
      res.status(500).json({
      message: 'Creating an Album failed'
      })
    }
    //handle max limit of albums
    if (count >= 3) {
      res.status(403).json({
        message: 'You can\'t have more than 3 albums'
      })
    } else {
    // First check Album properties
    let titleLength = req.body.title.length;
    if (titleLength < 4 || titleLength > 18 ) {
      res.status(403).json({
        message: 'Your title must have 4 caracters at least and less than 18.'
      });
    } else {
      // Then handle files and save Album
      const url = req.protocol + '://' + req.get("host");
      const files = req.files;
      files.forEach(file => {
        imagePath = url + '/images/photos/' + file.filename;
        imageAlt = '-Image-' + file.filename;
        let image = {path: imagePath, alt: imageAlt};
        formatedArrayOfFile.push(image);
      });
      const album = new Album({
        title: req.body.title,
        images: formatedArrayOfFile,
        linked_friendsId: [],
        creator: req.userData.userId,
      });
      album.save().then(createdAlbum => {
        res.status(201).json({
          message: 'Album added successfully',
          post: {
            ...createdAlbum,
            id: createdAlbum._id
          }
        });
      })
      .catch(error => {
        res.status(500).json({
          message: 'Creating an Album failed'
        })
      });
    }
  }}).catch(error => {
    res.status(500).json({
      message: 'Creating an Album failed'
    })
  });
}


exports.editAlbum = (req, res, next) => {

  const formatedArrayOfFile = [];
  let imagesPath = req.body.imagesPath;

  if(req.body.onAdd === 'true') {
    imagesPath.forEach(file => {
      formatedArrayOfFile.push(file);
    });
    if(req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/photos/" + req.file.filename;
      imageAlt = '-Image-' + req.file.filename;
      let image = {path: imagePath, alt: imageAlt};
      // console.log(imagesPath);
      if(formatedArrayOfFile.length <= 12) {
        formatedArrayOfFile.push(image);
      } else {
        res.status(403).json({ message: 'You can\'t upload more than 12 photos per album'});
      }
      // console.log(formatedArrayOfFile);
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
    imagesPath.forEach(file => {
      formatedArrayOfFile.push(file);
    })
    album = new Album({
    _id: req.body._id,
    title: req.body.title,
    images: formatedArrayOfFile,
    creator: req.body.creator
    });
    // console.log(formatedArrayOfFile);
  }

  // handle  title modification add new friends in list
  if(!req.body.imageToDeletePath && !req.body.onAdd && req.body.title.length >= 4 && req.body.title.length <= 18) {
    album = new Album({
      _id: req.body._id,
      title: req.body.title,
      images: imagesPath,
      creator: req.body.creator,
      linked_friendsId: req.body.linked_friendsId,
      created_date: req.body.created_date
    })
    album.validate(function(error) {
      if(error) {
          res.status(500).json({ message: 'One or many ID share are not existing in our database' })
      }
      else {
        Album.update({_id: req.body._id, creator: req.userData.userId}, album).then(result => {
          if(result.n > 0) {
            res.status(200).json({ message: 'update successfull' });
          } else {
            res.status(401).json({ message: 'Not authorized' });
          }
        }).catch(error => {
          res.status(500).json({ message: 'Couldn\'t update post'})
        })
      }
    })
  } else {
    Album.updateOne({_id: req.body._id, creator: req.userData.userId}, album).then(result => {
      if(result.n > 0) {
      res.status(200).json({ message: 'update successfull' });
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  })
  .catch(error => {
    res.status(500).json({ message: 'Couldn\'t update post'})
  });
}
}

exports.getAlbums = (req, res, next) => {
  const albumQuery = Album.find({ $or:[{ creator: req.query.userId }, { linked_friendsId: { "$in" : [req.query.userId] } }] })
  let fetchedAlbums;
  albumQuery.find({ $or:[{ creator: req.query.userId }, { linked_friendsId: { "$in" : [req.query.userId] } }] })
    .then(documents => {
      fetchedAlbums = documents;
      return Album.count({ $or:[{ creator: req.query.userId }, { linked_friendsId: { "$in" : [req.query.userId] } }] });
    })
    .then(count => {
      res.status(200).json({
        message: "Albums fetched succefully !",
        albums: fetchedAlbums,
        maxAlbums: count
      })
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching posts failed'})
    });
}

exports.getAlbum = (req, res, next) => {
  Album.findById(req.params.id).then(album => {
    if (album) {
      res.status(200).json(album);
    } else {
      res.status(404).json({message: "album not find"})
    }
  })
  .catch(error => {
    res.status(500).json({ message: 'Fetching album failed'})
  });
}

exports.deleteAlbum = (req, res, next) => {
  console.log(req.params.id);
  console.log(req.body);
  Album.findByIdAndDelete({_id: req.params.id}).then(result => {
    if(result) {
      result.imagesPath.forEach(photo => {
          async function deletePhoto(){
            let imageToDeleteFractionnalPath = photo.split("photos/").pop();
            let imageToDeleteFinalPath = "C:/Users/Nico/Desktop/Dév/Personnel/Projet/ImageAlbum/backend/images/photos/" + imageToDeleteFractionnalPath;
            let promise = new Promise((resolve, reject) => {
              setTimeout(() => resolve(fs.unlink(imageToDeleteFinalPath, function(error) {
                console.log(error);
              })), 1000)
            });

            let result = await promise; // wait till the promise resolves (*)
            }
            deletePhoto();
      });
      res.status(200).json({ message: 'deletion successfull' });
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  })
  .catch(error => {
    res.status(500).json({ message: 'Deletion failed'})
  });
}

