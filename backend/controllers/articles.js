const Album = require('../models/album');
const Article = require('../models/article');
const Comment = require('../models/comment');

/**
 * Async method to create a new Article.
 * First check that the userId is the owner of the album.
 * Ensure that the article is valid before saving it.
 *
 * @returns {json{message<string>, article<Article> if success}}
 */
exports.createArticle = async (req, res, next) => {

  /** checking that the userId is the owner of the album linked to this article */
  if (req.body.userId === req.userData.userId) {
    const url = req.protocol + '://' + req.get("host");
    const article = new Article(req.body);
    console.log(req.body);
    console.log(article);
    article.userId = req.body.userId;

    /** checking that we got a valid article, that he respects Article's model */
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

/**
 * Async method to edit an Article.
 * First get the edited article.
 * Ensure that the article is valid before saving it.
 *
 * @returns {json{message<string>}}
 */
exports.editArticle = async (req, res, next) => {

  const article = new Article(req.body);

  /** checking that we got a valid article, that he respects Article's model */
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
          userId: req.userData.userId,
        }, article);

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
};

/**
 * Async method to get the wanted article.
 *
 * @returns {json{article<Article> if success || message<string>}}
 */
exports.getArticle = async (req, res, next) => {

  try {
    let userAuth;
    const album = await Album.find({ albumId: req.query.albumId });

    if (req.params.id === album.userId) {
      userAuth = true;
    } else {
      for (i = 0; i <= album.sharedUsers.length - 1; i++) {
        if (req.params.id === album.sharedUsers[i]) {
          userAuth = true;
        } else {
          if (userAuth === true) {
            userAuth = true;
          } else {
            userAuth = false;
          }
        }
      }
    }

    if (userAuth === true) {
      const article = await Article.find({ albumId: req.query.albumId });
      res.status(200).json(article);
    } else {
      res.status(401).json({
        message: 'You don\'t have access to this article'
      });
    }
  } catch (e) {
    res.status(500).json({
      message: 'Fetching article failed'
    });
  }
};

/**
 * Async method to delete the wanted article.
 * Also delete the comments for the article.
 *
 * @returns {json{message<string>}}
 */
exports.deleteArticle = async (req, res, next) => {

  try {
    const result = await Article.deleteOne({
      _id: req.params.id,
      userId: req.userData.userId,
    });

    await Comment.deleteMany({
      articleId: req.params.id,
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
