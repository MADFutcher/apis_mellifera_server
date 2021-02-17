const AppError = require('../utils/AppError')

const handleJWTError = () =>
  new AppError("Invalid Token, Please Log in Again", 401)

const handleJWTExpiredToken = () =>
  new AppError("Your Token has Expired, Please Log in Again", 401)

const sendErrorDev = (err, req, res) =>{
  //API
  if(req.originalUrl.startsWith('/api')){
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })
  }
}

const sendErrorProd = (err, req, res) =>{
  if(req.originalUrl.startsWith('/api')){
    if(err.isOperational){
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    }
    console.log("ERROR!", err)
    return res.status(500).json({
      status:'Error',
      message: 'Sonething went very Wrong!'
    })
  }
}

module.exports=(err,req, res, next)=>{
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'

  if(process.env.NODE_ENV==='development'){
    sendErrorDev(err,req, res)
  }else if (process.env.NODE_ENV==='production'){
    let error = {...err}
    error.message = err.message
    // if(error.name ==='castError') error = handleCastErrorDB(error)
    // if(error.code === 11000) error = handleDuplicateFieldsDB(error)
    // if(error.name === 'ValidationError') error = handleValidationErrorDB(error)
    if(error.name === 'JsonWebTokenError') error = handleJWTError();
    if(error.name === 'TokenExpiredError') error = handleJWTExpiredToken()

    console.log(error.message, err.message)
    sendErrorProd(error, req, res)
  }
}