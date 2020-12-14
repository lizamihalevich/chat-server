const models = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = require("../config/jwtConfig");

module.exports = function(app) {
  app.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const User = models.user;

    const user = await User.findOne({
      where: {
        username: username
      }
    });
    if (!user) {
      return res.status(404).send({ error: "Username not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.username
        };

        const token = jwt.sign(payload, jwtSecret.secret);

        res.status(200).send({
          auth: true,
          token: token,
          message: "user found & signed in"
        });
      } else {
        return res.status(401).send({ error: "Password incorrect" });
      }
    });
  });
};
