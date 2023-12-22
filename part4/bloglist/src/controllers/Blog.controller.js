const blogsRouter = require("express").Router();
const Blog = require("../models/Blog.model");
const User = require("../models/User.model");
const jwt = require('jsonwebtoken')


blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate('user',{name:1,username:1})
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {

  const token = getTokenFromRequest(request);
  if(!token){
    return response.status(401).send()
  }

  const decodedToken = jwt.verify(token, process.env.SECRET)
  
  if (!decodedToken.id) {
    return response.status(401).json({
      error: 'token invalid'
    })
  }

  const isValid = validateParams(request.body);
  if (!isValid) {
    response.status(400);
  }
  const {title,author,url,likes} = request.body
  const userId = decodedToken.id
  const user = await User.findById(userId);
  const blog = new Blog({
    title,
    author,
    url,
    likes: likes === undefined ? 0 : likes,
    user:userId
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

const getTokenFromRequest = (request)=>{
  const authorization = request.get('Authorization')
  if(authorization && authorization.startsWith('Bearer ')){
    return authorization.replace('Bearer ', '')
  }
  return null
}

module.exports = blogsRouter;
