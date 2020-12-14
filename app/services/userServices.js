module.exports = {
  userlogin: data => {
    if (!data.password || !data.login) {
      return {
        success: false,
        error: "Password and login required",
        status: 400
      };
    }
  }
};
