const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/User.model");

usersRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

usersRouter.post("/", async (request, response) => {
  const isValid = validateParams(request.body)
  if(!isValid)  {
    return response.status(400).json({error: 'Invalid user data'})
  }
  const { name, username, password } = request.body;

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const newUser = new User({
    name,
    username,
    passwordHash,
  });

  const created = await newUser.save();

  response.status(201).json(created);
});

usersRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await User.findByIdAndDelete(id);
  response.status(204);
});

validateParams = ({ name, username, password }) => {
  return (
    username != undefined &&
    password != undefined &&
    username.length >= 3 &&
    password.length >= 3
  );
};

module.exports = usersRouter;
