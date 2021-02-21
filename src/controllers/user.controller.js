const { to } = require("await-to-js");
const BaseController = require("./common//base.controller");
const UserRepository = require("../repositories/user.repository");

module.exports = class UserController extends BaseController {
  constructor() {
    super("user", new UserRepository());
  }
};
