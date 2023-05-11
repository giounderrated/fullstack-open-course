const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/Blog.model");
const { initialBlogs } = require("../utils/ListHelper");
const BLOGS_ENDPOINT = "/api/v1/blogs/";

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogsObjects = initialBlogs.map(blog=> new Blog(blog));
  const promiseArray = blogsObjects.map(blog=>blog.save());
  await Promise.all(promiseArray)
});

test("blogs are returned as json", async () => {
  await api
    .get(BLOGS_ENDPOINT)
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

test("all blogs are returned", async () => {
  const response = await api.get(BLOGS_ENDPOINT);
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("a specific blog is within the returned blogs", async () => {
  const response = await api.get(BLOGS_ENDPOINT);
  const contents = response.body.map((b) => b.title);
  expect(contents).toContainEqual("React patterns");
});

test("a valid blog can be added", async () => {
  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post(BLOGS_ENDPOINT)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get(BLOGS_ENDPOINT);

  const contents = response.body.map((b) => b.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContainEqual("Canonical string reduction");
});

test("blog without title is not added", async () => {
  const newBlog = {
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api.post(BLOGS_ENDPOINT).send(newBlog).expect(400);

  const response = await api.get(BLOGS_ENDPOINT);
  expect(response.body).toHaveLength(initialBlogs.length);
});

afterAll(async () => {
  await mongoose.connection.close();
});
