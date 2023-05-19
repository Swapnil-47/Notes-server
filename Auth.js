const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    jwt.verify(token, "Secret-Thing"); // Use the same secret you used for token signing in checkUser endpoint
    console.log('User authenticated from AuthJS');
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({
      message: 'You are not authorized to access this page'
    });
  }
};
