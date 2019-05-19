const Article = require('../models/article');

exports.createArticle = (req, res, next) => {
  console.log(req.body);
  const url = req.protocol + '://' + req.get("host");
  const article = new Article({
    title: req.body.title,
    // paragraphs: req.body.paragraphs,
    creator: req.userData.userId,
    albumId: req.body.albumId
  });
  console.log(article);
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
  Article.find({albumId: req.body.albumId}).then(article => {
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




