const mongoose = require('mongoose');

const articleSchema = mongoose.Schema({
  title: { type: String, required: true},
  paragraphs: [{
    content: { type: String, required: true },
    path: { type: String, required: true },
    alt: { type: String, required: true },
  }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  albumId: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Article', articleSchema);
