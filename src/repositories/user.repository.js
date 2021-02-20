const BaseRepository = require("./common/base.repository");
const User = require("../models/user");

module.exports = class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }
};
