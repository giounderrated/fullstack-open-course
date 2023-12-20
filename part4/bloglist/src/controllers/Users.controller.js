const usersRouter = require("express").Router();
const bcrypt = require("bcrypt")
const User = require("../models/User.model") 


usersRouter.get("/", async (request,response)=>{
  const users = await User.find({})
  response.json(users)
})

usersRouter.post("/", async(request,response)=>{
  const { name, username, password } = request.body
  
  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const newUser = new User({
    name,
    username,
    passwordHash
  })

  const created = await newUser.save();

  response.status(201).json(created)
})

usersRouter.delete("/:id", async(request,response)=>{
  const id = request.params.id
  await User.findByIdAndDelete(id)
  response.status(204)
})




module.exports = usersRouter;