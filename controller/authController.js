const jwt = require('jsonwebtoken')
const AppError = require('../utils/AppError')
const CatchAsync = require('../utils/CatchAsync')
const {promisify} = require('util')
const User = require('../models/user-model')

const signToken = (id) => {
  console.log(id)
  return jwt.sign({id}, "TOPSECTRET", {
    expiresIn: "1d"
  })
}

exports.createSendToken = (user, req, res) =>{
  console.log(req)
  const token = signToken(user._id)
  
  res.cookie('jwt', token, {
    expires: new Date(Date.now()+ 60*60*1000),
    httpOnly: true,
    secure: req.secure || req.headers['x-forward-proto'] == 'https'
  })
  
  user.password = undefined
  res.status(200).json({
    status: 'succcess',
    token,
    data:{
      user
    }
  })
}


exports.protect = CatchAsync(async(req,res,next)=>{
  let token
  if(req.headers.authorization &&
     req.headers.authorization.startsWith('Bearer')
    ){
      token = req.headers.authorization.split(' ')[1]
    }else if(req.cookies.jwt){
      token = req.cookies.jwt
    }

    if(!token){
      return next(new AppError('You are not logged in! please Log in to get Access', 401))
    }

    const decoded = await promisify(jwt.verify)(token, "TOPSECTRET")

    const currentUser = await User.findById(decoded.id)
    if(!currentUser){
      return next(new AppError('This User no longer exists!', 401))
    }

    req.user=currentUser
    res.locals.user=currentUser
    next()

})
