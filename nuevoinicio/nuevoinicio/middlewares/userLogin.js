

const userLogin = (req, res, next) => {
    console.log("Middleware ejecutado");
    next();
  };
  
  module.exports = userLogin;

  
  