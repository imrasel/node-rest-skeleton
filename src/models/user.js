const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaModel = new Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String, select: false },
  },
  {
    timestamps: true
  }
);

schemaModel.set('toJSON', {
  transform: function (doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
  }
}); 

module.exports = mongoose.model('User', schemaModel);
