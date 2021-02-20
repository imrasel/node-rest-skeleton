const { requestLogger, infoLogger } = require("../../helpers/functions");
const AbstractChecker = require("../../utils/abstractChecker");
const Logger = require('../../utils/logger');
const logger = new Logger('repo').getLogger();

module.exports = class BaseRepository {
  constructor(schema) {
    AbstractChecker.check(this, new.target, ["create", "update"]);
    this._schema =  schema;
  }

  async getAll(queryParams) {
    let limit = queryParams.pageSize || 100;

    let schema;

    schema = await this._schema.find(); 

    return schema;
  }

  async getCount() {
    let query = mysql.format(`select count(*) from ${this._tableName}`);
    return await this.execute(query);
  }

  async create(entity) {
    requestLogger(entity);
    let schema;
    schema = await this._schema(entity).save(); 
    return schema;
  }

  async update(id, entity) {
    // console.log('entity', entity)
    let schema;
    schema = await this._schema.updateOne({ _id: id }, entity); 
    return schema;
  }

  async getById(id) {
    let schema;
    schema = await this._schema.findById(id); 
    return schema;
  }

  async getOne(query) {
    let schema;
    schema = await this._schema.findOne(query); 
    return schema;
  }

  async get(query) {
    let schema;
    schema = await this._schema.find(query); 
    return schema;
  }

  async delete(id) {
    let schema;
    schema = await this._schema.deleteOne({ _id: id }); 
    return schema;
  }
};
