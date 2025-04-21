const mongoose = require('mongoose');

const webinarSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  beginning_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  venue: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    enum: ['Online', 'Offline', 'Hybrid'],
    default: 'Online',
    required: true
  },
  expert: {
    type: String,
    required: true
  },
  expert_experience: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  expert_image: {
    data: {
      type: Buffer,
      required: true
    },
    contentType: {
      type: String,
      required: true
    }
  },
  part1: {
    type: String,
    required: false
  },
  part2: {
    type: String,
    required: false
  },
  part3: {
    type: String,
    required: false
  },
  specialref: {
    type: String,
    require: false,
    trim: true
  },
  discount: {
    type: Number,
    require: false
  }
}, { collection: 'Webinar_Info' });

module.exports = mongoose.model('Webinar_Info', webinarSchema);
