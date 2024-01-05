const blogsRouter = require("express").Router();
const Blog = require("../models/Blog.model");
const jwt = require("jsonwebtoken");
const middleware = require("../utils/Middleware");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { name: 1, username: 1 });
  response.json(blogs);
});

blogsRouter.post("/", middleware.userExtractor, async (request, response) => {
  const isValid = validateParams(request.body);
  if (!isValid) {
    response.status(400);
  }
  const { title, author, url, likes } = request.body;

  const user = await request["user"];

  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes,
    user: user.id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    response.status(404).send();
  }
  response.status(200).json(blog);
});

blogsRouter.put("/:id", middleware.userExtractor, async (request, response) => {
  const id = request.params.id;

  const exists = await Blog.findById(request.params.id);

  if (!exists) {
    response.status(404).send();
  }

  const user = await request["user"];
  
  if (exists.user.toString() !== user.id.toString()) {
    return response
      .status(401)
      .send({ error: "Invalid permissions to update this blog" });
  }

  const {title,author,url,likes} = request.body;
  
  const blog = {
    title,
    author,
    url,
    likes,
    user:exists.user
  }

  const updated = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.status(200).json(updated);
});

blogsRouter.delete(
  "/:id",
  middleware.userExtractor,
  async (request, response) => {
    const user = await request["user"];

    const blogId = request.params.id;

    const blog = await Blog.findById(blogId);
    if (blog.user.toString() !== user.id.toString()) {
      return response
        .status(401)
        .send({ error: "Invalid permissions to delete this blog" });
    }

    await Blog.findByIdAndDelete(blogId);
    response.status(204).send();
    er;
  }
);

validateParams = ({ title, author, url, userId }) => {
  return title && title.length >= 3 && author && author.length >= 3 && userId;
};

module.exports = blogsRouter;
