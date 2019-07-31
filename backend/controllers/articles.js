const Article = require('../models/article');
const Comment = require('../models/comment');

/**
 * Async method to create a new Article.
 * First check that the creator is the owner of the album.
 * Ensure that the article is valid before saving it.
 *
 * @returns {json{message<string>, article<Article> if success}}
 */
exports.createArticle = async (req, res, next) => {

  /** checking that the creator is the owner of the album linked to this article */
  if (req.body.owner === req.userData.userId) {
    const url = req.protocol + '://' + req.get("host");
    const article = new Article(req.body);
    article.creator = req.body.owner;

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
          creator: req.userData.userId,
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
    const article = await Article.find({ albumId: req.query.albumId });
    res.status(200).json(article);
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
      creator: req.userData.userId,
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
