const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let FlappyModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const FlappySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  score: {
    type: Number,
    min: 1,
    required: true,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },

});

FlappySchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  score: doc.score,
});

FlappySchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertId(ownerId),
  };

  return FlappyModel.find(search).select('name age score').lean().exec(callback);
};

FlappySchema.statics.findAll = (callback) => FlappyModel.find().select('name age score').lean().exec(callback);

FlappyModel = mongoose.model('Flappy', FlappySchema);

module.exports.FlappyModel = FlappyModel;
module.exports.FlappySchema = FlappySchema;
