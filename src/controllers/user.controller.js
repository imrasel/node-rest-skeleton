const { to } = require("await-to-js");
const BaseController = require("./base.controller");
// const ErrorHandler = require('../../utils/error_handler');
const UserRepository = require("../repositories/user.repository");

module.exports = class UserController extends BaseController {
  constructor() {
    super("user", new UserRepository());
  }
};
