const mongoose = require('mongoose');

const albumSchema = mongoose.Schema({
  title: { type: String, required: true },
  imagesPath: [],
  // linked_friendsId: [],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Album', albumSchema);
