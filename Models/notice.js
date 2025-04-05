const mongoose = require('mongoose');
const { Schema } = mongoose;


const noticeSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  CreaterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },
  fileUrl: {
    type: String,
    default: null
  },
  fileType: {
    type: String,
    enum: ['pdf', 'doc', 'image', 'other'],
    default: 'other'
  },
  category: {
    type: String,
    default: 'General'
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  expiryDate: {
    type: Date,
    default: function() {
      
      const date = new Date();
      date.setDate(date.getDate() + 30);
      return date;
    }
  }
});



noticeSchema.index({ userId: 1 });
noticeSchema.index({ createdAt: -1 });
noticeSchema.index({ category: 1, createdAt: -1 });
noticeSchema.index({ isImportant: 1, createdAt: -1 });


noticeSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});


noticeSchema.virtual('isExpired').get(function() {
  return this.expiryDate < new Date();
});


const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;