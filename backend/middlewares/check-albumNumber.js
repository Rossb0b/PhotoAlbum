const Album = require('../models/album');

module.exports = (req, res, next) => {
    try {
      Album.countDocuments({ creator: req.userData.userId }, function(err, count) {
        if (err) {
          res.status(500).json({
            message: 'Cannot find and count album for this user'
          });
        } else if (count >= 3) {
          res.status(406).json({
            message: 'You can\'t have more than 3 albums'
          });
        } else {
          next();
        }
      });
    } catch (e) {
      //** debugging */
      console.error(e);
    }
};
