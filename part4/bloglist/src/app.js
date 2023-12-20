const express = require("express");
const app = express();
require('express-async-errors')
const cors = require("cors");
const config = require("./utils/Config");
const logger = require("./utils/Logger");
const middleware = require("./utils/Middleware");
const mongoose = require('mongoose')


const blogsRouter = require("./controllers/Blog.controller");
const usersRouter = require("./controllers/Users.controller");
const BLOGS_PATH = "/api/blogs";
const USERS_PATH = "/api/users"

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use(BLOGS_PATH, blogsRouter);
app.use(USERS_PATH, usersRouter);


mongoose.set("strictQuery", false);

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app


