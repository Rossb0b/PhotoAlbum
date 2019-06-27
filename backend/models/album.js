const mongoose = require('mongoose');
const User = require('./user');

const albumSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    minLength: [ 4, 'Your album\'s title must have a length of 4 caracters at least' ],
    maxLength: [ 18, 'Your album\'s title must have a length of 18 caracters maximum' ],
  },
  images: [{
    path: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      required: true,
    }
  }],
  linked_friendsId: [ {
    type: String,
    validate: function(v) {
      return new Promise(function(resolve, reject) {
        setTimeout(() => {
          resolve(User.findById(v));
        }, 5);
      });
    },
    required: true,
  } ],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now
  },
});

module.exports = mongoose.model('Album', albumSchema);
