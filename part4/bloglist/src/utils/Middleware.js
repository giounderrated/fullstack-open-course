const logger = require("../utils/Logger");
const User = require("../models/User.model");
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('Authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    request['token'] = authorization.replace('Bearer ', '')
  }
  else{
    request['token'] = null
  }
  next()
}

const userExtractor = async (request,response,next)=>{
  const token = request['token']
  if(!token){
    return response.status(401).send()
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)

  if(!decodedToken.id){
    return response.status(401).json({
      error: 'token invalid'
    })
  }
  const userId = decodedToken.id
  const user = await User.findById(userId);
  console.log(user);
  request['user'] = user;
  next()

}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
};
