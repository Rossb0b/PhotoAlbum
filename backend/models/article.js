const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [ 4, 'Your article\'s title must have a length of 4 caracters at least' ],
    maxLength: [ 34, 'Your article\'s title must have a length of 34 caracters maximum' ],
  },
  paragraphs: [{
    content: {
      type: String,
      required: true,
      minLength: [ 80, 'Your paragraph\'s content must have a length of 80 caracters at least' ],
      maxLength: [ 525, 'Your paragraph\'s content must have a length of 525 caracters maximum' ],
    },
    path: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    },
  }],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Article', articleSchema);
