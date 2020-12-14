const models = require("../models");
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/userRepository");

module.exports = function (app) {
  app.post("/register", async (req, res) => {
    const password = req.body.password;
    const User = models.user;

    const generateHash = function (password) {
      return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    };

    console.log(userRepository);
    const user = await userRepository.findUser(req.body.email).catch((err) => {
      console.log(err);
    });

    if (user) {
      return res.status(400).send({ error: "Email already exists" });
    } else {
      const userPassword = generateHash(password);

      const user = {
        email: req.body.email,
        password: userPassword,
        username: req.body.username,
      };

      try {
        await userRepository.createUser(user);
        console.log("User was added to db!");
        res.status(200).send(user);
      } catch (err) {
        console.log(err);
      }
    }
  });
};
