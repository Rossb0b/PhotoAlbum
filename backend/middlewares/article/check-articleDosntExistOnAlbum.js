const Article = require('../../models/article');

module.exports = async (req, res, next) => {
    try {
      Article.countDocuments({ albumId: req.body.albumId }, (err, count) => {
       
        if (err) {
          next();
        }

        if (count !== 0) {
            res.status(406).json({
                message: 'You can\'t have more than 1 article by album',
            })
        } else {
            next();
        }

      });
    } catch (e) {
      /** debugging */
      console.error(e);
    }
};
