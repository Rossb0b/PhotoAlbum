const Comment = require('../models/comment');

exports.createComment = async (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const comment = new Comment({
    content: req.body.content,
    creator: req.userData.userId,
    articleId: req.body.articleId,
  });

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
        console.log(e);
        res.status(500).json({
          message: 'Creating comment failed',
        });
      }
    }

  });
};

exports.editComment = async (req, res, next) => {
  const comment = new Comment (req.body);

  comment.validate(async (error) => {

    if (error) {
      res.status(500).json({
        message: 'not valid comment',
      });
    } else {
      try {
        const result = await Comment.updateOne({
          _id: req.body._id,
          creator: req.userData.userId,
          articleId: req.body.articleId,
        });

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

exports.getCommentsForThisArticle = async (req, res, next) => {
  try {
    const comments = await Comment.find({
      articleId: req.query.articleId,
    });
    res.status(200).json({
      message: 'Fetched comments successfully',
      comments: comments,
    });
  } catch (e) {
    res.status(500).json({
      message: 'Fetching comments failed',
    });
  }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const result = Comment.deleteOne({
      _id: req.params.id,
      creator: req.userData.userId
    });

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
    res.status(500).json({
      message: 'Deleting comment failed',
    });
  }
};
