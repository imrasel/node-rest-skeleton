const BaseRepository = require("./common/base.repository");
const User = require("../models/user");

module.exports = class AuthRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async getOne(query) {
    let schema;
    schema = await this._schema.findOne(query).select('+password'); 
    return schema;
  }
};
