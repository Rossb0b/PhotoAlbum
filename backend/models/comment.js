const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
  content: { type: String, required: true},
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
