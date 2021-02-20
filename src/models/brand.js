const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaModel = new Schema(
  {
    name: { type: String },
    logo: { type: String },
    top: { type: Number },
    slug: { type: String },
    seo: { type: Object },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    meta: { type: Object },
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

module.exports = mongoose.model('Brand', schemaModel);