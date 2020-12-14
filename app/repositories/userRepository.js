const models = require("../models");
const User = models.user;

module.exports = {
  createUser: user => {
    return User.create(user);
  },

  findUser: username => {
    return User.findOne({
      where: {
        username: username
      }
    });
  }
};
