const { to } = require("await-to-js");
const ErrorHandler = require("../utils/errorHandler");
const Logger = require("../utils/logger");
const AbstractChecker = require("../utils/abstractChecker");
const HttpError = require("../utils/httpError.response");

module.exports = class BaseController {
  constructor(controllerName, repository) {
    AbstractChecker.check(this, new.target, ["create", "update"]);
    this._controllerName = controllerName;
    this._repository = repository;
    this._logger = new Logger(`controller-${this._controllerName}`).getLogger();
  }

  async create(req, res, next) {
    
    try {
      // let hello = hi;
      
      let user = req.body;
      const [err, data] = await to(this._repository.create(user));
      ErrorHandler.handleError(err);

      return res.status(200).json(data);
    } catch (error) {
      this._logger.error("Error: ", error.stack);
      return next(new HttpError(`Creating ${ this._controllerName } failed.`, 500));
    }
  }

  async update(req, res, next) {
    try {
      let id = req.params.id;
      let user = req.body;
      const [err, data] = await to(this._repository.update(id, user));
      ErrorHandler.handleError(err);

      return res.status(200).json(data);
    } catch (error) {
      this._logger.error("Error: ", error.stack);
      return res.status(500).send(`Updating ${ this._controllerName } failed.`);
    }
  }

  async index(req, res, next) {
    try {
      let queryParams = req.query;
      const [err, data] = await to(this._repository.getAll(queryParams));
      ErrorHandler.handleError(err);

      return res.status(200).json(data);
    } catch (error) {
      this._logger.error("Error: ", error.stack);
      return res.status(500).send(`Get all ${this._controllerName}s failed.`);
    }
  }

  async getById(req, res, next) {
    try {
      let id = req.params.id;
      const [err, data] = await to(this._repository.get(id));
      ErrorHandler.handleError(err);

      return res.status(200).json(data);
    } catch (error) {
      this._logger.error("Error: ", error.stack);
      return res.status(500).send(`Get ${this._controllerName} failed.`);
    }
  }

  async delete(req, res, next) {
    try {
      let id = req.params.id;
      const [err, data] = await to(this._repository.delete(id));
      ErrorHandler.handleError(err);

      return res.status(200).json(data);
    } catch (error) {
      this._logger.error("Error: ", error.stack);
      return res.status(500).send(`Deleting ${this._controllerName} failed.`);
    }
  }
};
