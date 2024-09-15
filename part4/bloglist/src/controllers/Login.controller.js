const loginRouter = require("express").Router();
const User = require("../models/User.model")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const {SECRET} = require('../utils/Config')

loginRouter.post("/", async(request,response)=>{
  const {username,password} = request.body 
  const user = await User.findOne({username})
  
  const exists = user!=null
  const passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  
  if(!exists || !passwordCorrect){
    return response.status(401).json({
      error:'Invalid username or password'
    })
  }

  const userData = {
    id:user.id,
    username:user.username
  }
  const token = jwt.sign(userData, SECRET)

  response
  .status(200)
  .send({ token, username: user.username, name: user.name })

})

module.exports = loginRouter

