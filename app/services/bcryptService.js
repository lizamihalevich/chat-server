const bcrypt = require("bcrypt");

module.exports = {
    generateHash = (password) => {
        return bcrypt.hash(password, bcrypt.genSaltSync(8), (err, hash) => {
            
        })
    }
}