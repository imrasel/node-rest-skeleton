const usersRoutes = require('./user.routes');
const authRoutes = require('./auth.routes');
const brandRoutes = require('./brand.routes');
const HttpError = require('../utils/httpError.response')

const routes = app => {

  //cms routes
  app.use('/users', usersRoutes);
  app.use('/auth', authRoutes);

  app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    next(error);
  });

}

module.exports = routes;
