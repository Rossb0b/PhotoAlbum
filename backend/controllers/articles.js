const Article = require('../models/article');

exports.createArticle = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const article = new Article({
    title: req.body.title,
    paragraphs: req.body.paragraphs,
    creator: req.userData.userId,
    albumId: req.body.albumId
  });
  article.save().then(createdArticle => {
    res.status(201).json({
      message: 'Article added successfully',
      post: {
        ...createdArticle,
        id: createdArticle._id
      }
    });
  })
  .catch(error => {
    res.status(500).json({
      message: 'Creating an Article failed'
    })
  });
}

exports.getArticle = (req, res, next) => {
  Article.find({albumId: req.query.albumId}).then(article => {
    if (article) {
      res.status(200).json(article);
      } else {
        res.status(404).json({message: "article not find"})
      }
    })
    .catch(error => {
      res.status(500).json({ message: 'Fetching article failed'})
    });
}

exports.deleteArticle = (req, res, next) => {
  Article.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
    if(result.n > 0) {
      res.status(200).json({ message: 'deletion successfull' });
    } else {
      res.status(401).json({ message: 'Not authorized' });
    }
  })
  .catch(error => {
    res.status(500).json({ message: 'Fetching posts failed'})
  });;
}




