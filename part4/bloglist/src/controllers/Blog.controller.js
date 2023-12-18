const blogsRouter = require("express").Router();
const Blog = require("../models/Blog.model");

blogsRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({})
  response.json(blogs);
});

blogsRouter.post("/", async (request, response) => {
  const body = request.body
  if(!body.hasOwnProperty("title") || !body.hasOwnProperty("url") ){
    response.status(400)
  }
  const blog = new Blog(body);
  const savedBlog = await blog.save();
  response.status(201).json(savedBlog);

});

blogsRouter.get("/:id", async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if(!blog){
    response.status(404).send()
  }
  response.status(200).json(blog);
});

blogsRouter.put("/:id", async (request,response)=>{
  const id = request.params.id

  const exists = await Blog.findById(request.params.id);
  
  if(!exists){
    response.status(404).send()
  }

  const body = request.body;
  const blog = {
    ...body
  }
  const updated = await Blog.findByIdAndUpdate(id, blog, {new: true})
  response.status(200).json(updated)
})

blogsRouter.delete("/:id", async (request,response)=>{
  const id = request.params.id;
  await Blog.findByIdAndDelete(id)
  response.status(204).send()
})

module.exports = blogsRouter;
