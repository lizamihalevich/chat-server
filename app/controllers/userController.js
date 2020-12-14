const userServices = require("../services/userServices");

module.exports = {
    loginUser: () => {
        const message = await userServices.userLogin(req.body);
        return res.status(message.status).json(message);
    },

    signupUser: () => {
        const message = await userServices
    }
}
