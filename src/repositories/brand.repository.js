const Brand = require('../models/brand');

module.exports.getById = async id => {
  let brand;
  
  try {
    brand = await Brand.findById(id);
  } catch(err) {
    return {
      error: true,
      message: err
    };
  }

  return brand;
}

module.exports.findOneByQuery = async (query) => {
  let brand;
  
  try {
    brand = await Brand.findOne(query);
  } catch(err) {
    return {
      error: true,
      message: err
    };
  }

  return brand;
}

module.exports.findByQuery = async (query) => {
  let brand;
  
  try {
    brand = await Brand.find(query);
  } catch(err) {
    return {
      error: true,
      message: err
    };
  }

  return brand;
}

module.exports.create = async (data) => {
  const brand = new Brand(data);

  try {
    await brand.save();
  } catch (err) {
    return {
        error: true,
        message: err
    };
  }

  return brand;
}

module.exports.get = async () => {

  let brands;
  try {
    brands = await Brand.find({});
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  return brands;
}

module.exports.update = async (data, id) => {
  let brand;
  try {
    brand = Brand.updateOne({ _id: id }, data);
  } catch (err) {
    return {
        error: true,
        message: err
    };
  }

  return brand;
}

module.exports.delete = (id) => {
  let brand;
  try {
    brand = Brand.deleteOne({ _id: id });
  } catch (err) {
    return {
        error: true,
        message: err
    };
  }

  return brand;
}