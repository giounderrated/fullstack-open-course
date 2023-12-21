const blogsRouter = require("express").Router();
const Blog = require("../models/Blog.model");
const User = require("../models/User.model");
blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{name:1,username:1})
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const isValid = validateParams(request.body);
  if (!isValid) {
    response.status(400);
  }
  const {title,author,url,likes,userId} = request.body
  const user = await User.findById(userId);
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes,
    user:user.id
  });
  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog)
  await user.save()
  response.status(201).json(savedBlog);
});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) {
    response.status(404).send();
  }
  response.status(200).json(blog);
});

blogsRouter.put("/:id", async (request, response) => {
  const id = request.params.id;

  const exists = await Blog.findById(request.params.id);

  if (!exists) {
    response.status(404).send();
  }

  const body = request.body;
  const blog = {
    ...body,
  };
  const updated = await Blog.findByIdAndUpdate(id, blog, { new: true });
  response.status(200).json(updated);
});

blogsRouter.delete("/:id", async (request, response) => {
  const id = request.params.id;
  await Blog.findByIdAndDelete(id);
  response.status(204).send();
});

validateParams = ({ title, author, url, userId }) => {
  return (
    title &&
    title.length >= 3 &&
    author &&
    author.length >= 3 &&
    userId
  );
};

module.exports = blogsRouter;
