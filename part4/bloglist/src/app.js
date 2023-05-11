const express = require("express");
const app = express();
require('express-async-errors')
const cors = require("cors");
const config = require("./utils/Config");
const logger = require("./utils/Logger");
const middleware = require("./utils/Middleware");
const mongoose = require('mongoose')


const blogsRouter = require("./controllers/Blog.controller");
const BLOGS_PATH = "/api/v1/blogs/";

app.use(cors());
app.use(express.static("build"));
app.use(express.json());
app.use(middleware.requestLogger);

app.use(BLOGS_PATH, blogsRouter);

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


