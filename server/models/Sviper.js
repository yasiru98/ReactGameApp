//holds sviper game scores
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
const _ = require('underscore');

let SviperModel = {};

const convertId = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();

const SviperSchema = new mongoose.Schema({
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

SviperSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  score: doc.score,
});

SviperSchema.statics.findByOwner = (ownerId, callback) => {//find scores by user
  const search = {
    owner: convertId(ownerId),
  };

  return SviperModel.find(search).select('name age score').lean().exec(callback);
};

SviperSchema.statics.findAll = (callback) => SviperModel.find().select('name age score').lean().exec(callback);//find all scores

SviperModel = mongoose.model('Sviper', SviperSchema);

module.exports.SviperModel = SviperModel;
module.exports.SviperSchema = SviperSchema;
