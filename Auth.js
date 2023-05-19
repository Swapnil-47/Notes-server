const jwt = require('jsonwebtoken');

//(AuthJS)it is nothing but a function
module.exports = (req,res,next)=>{

  try{
    const token = req.headers.authorization.split(" ")[1];
    console.log(token);
    jwt.verify(token,"Secret");
    console.log('user Authenticated from AuthJS')
    next();
  }
  catch{
    console.log(error);
    res.status(401).json({
      message:'You are not Authorized to access this page'
    })
  }
}
