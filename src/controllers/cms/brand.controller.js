const HttpError =  require('../../utils/httpError.response');
const  brandRepository  = require('../../repositories/brand.repository');

module.exports.get = async (req, res, next) => {
  let brands = await brandRepository.get();
  if (brands.error)  return next(new HttpError(user.message, 500));

  res.status(200).json({ error: false, data: brands });
}

module.exports.getById = async (req, res, next) => {
  const  brandId = req.params.brandId;
  
  let brand = await brandRepository.getById(brandId);
  if (brand.error)  return next(new HttpError(brand.message, 500));

  res.status(200).json({ error: false, data: brand, message: 'Success' });
}

module.exports.getBySlug = async (req, res, next) => {
  const slug = req.params.slug;
  
  let brand = await brandRepository.findOneByQuery({ slug: slug });
  if (brand.error)  return next(new HttpError(brand.message, 500));

  res.status(200).json({ error: false, data: brand, message: 'Success' });
}

module.exports.create = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) res.status(422).json(validationResult(req));
  const { name, top, seo} = req.body;

  // check user exists
  let slug = name.toLowerCase().replace(' ', '-');
  if (await brandRepository.findOneByQuery({ slug: slug })) return next(new HttpError('Brand already exists', 422));

  const data = {
    name,
    slug,
    top,
    seo,
  };

  let brand = await brandRepository.create(data);
  if (brand.error) {
    return next(new HttpError(brand.message, 500));
  }
  res.status(201).json({error: false, data: brand, message: 'Brand created successfully' });
}

module.exports.update = async (req, res, next) => {
  // throw new HttpError('Could not find');
  let brandId = req.params.brandId;
  const { name } = req.body;

  // check user exists
  let slug = name.toLowerCase().replace(' ', '-');
  if (await brandRepository.findOneByQuery({ slug: slug,  _id: { $ne: brandId } })) return next(new HttpError('Brand already exists', 422));

  let data = {
    name,
    slug
  }

  let brand = await brandRepository.update(data, brandId);
  if (brand.error) {
    return next(new HttpError(brand.message, 500));
  }

  res.status(200).json({ data: brand, message: 'Brand successfully updated' });
}

module.exports.delete = async (req, res, next) => {
  let brandId = req.params.brandId;

  let brand = await brandRepository.delete(brandId);
  if (brand.error) {
    return next(new HttpError(brand.message, 500));
  }

  res.status(200).json({ data: brand, message: 'Brand successfully deleted' });
}
