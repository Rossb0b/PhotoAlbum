const Article = require('../models/article');

exports.createArticle = async (req, res, next) => {
  if (req.body.owner == req.userData.userId) {
    const url = req.protocol + '://' + req.get("host");
    const article = new Article(req.body);
    article.creator = req.body.owner;


    article.validate(async (error) => {
      if (error) {
        res.status(500).json({
          message: 'not valid article',
          error: error,
        });
      } else {

        try {
          const createdArticle = await article.save();
          res.status(201).json({
            message: 'Article added successfully',
            article: {
              ...createdArticle,
              id: createdArticle._id
            },
          });
        } catch (e) {
          res.status(500).json({
            message: 'Creating an Article failed'
          });
        }

      }
    });
  } else {
    res.status(401).json({
      message: 'Not authorized'
    });
  }
};

exports.editArticle = async (req, res, next) => {
  const article = new Article(req.body);

  article.validate(async (error) => {
    if (error) {
      res.status(500).json({
        message: 'not valid article',
        error: error,
      });
    } else {

      try {
        let result = await Article.updateOne({
          _id: article._id,
          creator: req.userData.userId,
        }, article)  

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
          message: 'Couldn\'t update article'
        });
      }

    }
  });
}

exports.getArticle = async (req, res, next) => {
  try {
    const article = await Article.find({ albumId: req.query.albumId });
    res.status(200).json(article);
  } catch (e) {
    res.status(500).json({
      message: 'Fetching article failed'
    });
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const result = await Article.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    });

    if(result.n > 0) {
      res.status(200).json({
        message: 'deletion successfull'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized'
      });
    }
  } catch (e) {
    res.status(500).json({
      message: 'Delete article failed'
    });
  }
};




