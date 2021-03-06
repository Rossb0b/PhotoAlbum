const Comment = require('../models/comment');
const Album = require('../models/album');
const Article = require('../models/article');

/**
 * Async method to create a new Comment.
 * Init the comment send by the request.
 * Ensure that the comment is valid.
 *
 * @returns {json{message<string>, comments<Comment[]> if success}}
 */
exports.createComment = async (req, res, next) => {

  const url = req.protocol + '://' + req.get("host");
  const comment = new Comment({
    content: req.body.content,
    userId: req.userData.userId,
    articleId: req.body.articleId,
  });

  /** checking that we got a valid comment, that he respects Comment's model */
  comment.validate(async (error) => {

    if (error) {
      res.status(500).json({
        message: 'not valid comment',
      });
    } else {
      try {
        const createdComment = await comment.save();
        res.status(201).json({
          message: 'Comment added successfully',
          comments: {
            ...createdComment,
            _id: createdComment._id,
          },
        });
      } catch (e) {
        res.status(500).json({
          message: 'Creating comment failed',
        });
      }
    }

  });
};

/**
 * Async method to edit a Comment.
 * Init the comment edited send by the request.
 * Ensure that the comment is valid.
 *
 * @returns {json{message<string>}}
 */
exports.editComment = async (req, res, next) => {

  const comment = new Comment (req.body);

  /** checking that we got a valid comment, that he respects Comment's model */
  comment.validate(async (error) => {

    if (error) {
      res.status(500).json({
        message: 'not valid comment',
      });
    } else {
      try {

        const result = await Comment.updateOne({
          _id: comment._id,
          userId: req.userData.userId,
          articleId: req.body.articleId,
        }, comment);

        if (result.n > 0) {
          res.status(200).json({
            message: 'Updated comment successfully',
          });
        } else {
          res.status(401).json({
            message: 'Not authorized',
          });
        }

      } catch (e) {
        res.status(500).json({
          message: 'Couldn\'t update comment',
        });
      }
    }

  });
};

/**
 * Async method to get the comments for this Article.
 *
 * @returns {json{message<string>, comments<Comment[]> if success}}
 */
exports.getCommentsForThisArticle = async (req, res, next) => {

  try {
    checkUserShare(req.query.articleId);

    const comments = await Comment.find({
      articleId: req.query.articleId,
    });

    res.status(200).json({
      message: 'Fetched comments successfully',
      comments: comments,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Fetching comments failed',
    });
  }
};

/**
 * Async method to delete the wanted comment.
 * First get the comment to get the article to identify the article userId.
 * If the article userId is the user connected, allow him to delete any comment.
 * If not, only the comment userId can delete it.
 *
 * @returns {json{message<string>}}
 */
exports.deleteComment = async (req, res, next) => {

  try {
    const comment = await Comment.findById(req.params.id);

    const article = await Article.findById(comment.articleId);
    let result;

    if (article.userId == req.userData.userId) {
      result = await Comment.deleteOne({_id: req.params.id});
    } else {
      result = await Comment.deleteOne({
        _id: req.params.id,
        userId: req.userData.userId,
      });
    }

    if (result.n > 0) {
      res.status(200).json({
        message: 'deletion successfull',
      });
    } else {
      res.status(401).json({
        message: 'Not authorized',
      });
    }

  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: 'Deleting comment failed',
    });
  }
};

/**
 * Async method that check if the user that want to access the article and comments is a known one.
 *
 * @param {string} articleId
 * @returns {void || json{message<string>}}
 */
checkUserShare = async (articleId) => {
  try {
    const article = await Article.findById(articleId);

    const album = await Album.findOne({
      albumId: article.albumId
    });

    /**
     * If the user is the owner, the logic follow her way.
     * Same if he is part of the list of sharedUsers array.
    */
    if (req.params.userId === album.userId) {
      next();
    } else {
      album.sharedUsers.forEach(user => {
        if (req.params.user === user) {
          next();
        }
      });
    }
  } catch (e) {
    res.status(500).json({
      message: 'Couldn\'t find the article'
    });
  }
};
