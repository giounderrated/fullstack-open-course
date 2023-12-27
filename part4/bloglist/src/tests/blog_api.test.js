const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Blog = require("../models/Blog.model");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");

const { initialBlogs } = require("../utils/list_helper");

const BLOGS_ENDPOINT = "/api/blogs/";
const AUTH_ENDPOINT = "/api/auth/login";

const username = "giodev";
const name = "Giovani";
const SECRET = "test123";
const ROUNDS = 10;

beforeEach(async () => {
  // Add User to get auth Token
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash(SECRET, ROUNDS);
  const user = new User({
    name,
    username,
    passwordHash,
  });
  const userCreated = await user.save();

  // Add blogs
  await Blog.deleteMany({});
  const blogsObjects = initialBlogs.map(
    (blog) =>
      new Blog({
        ...blog,
        user: userCreated.id,
      })
  );
  const promiseArray = blogsObjects.map((blog) => blog.save());
  await Promise.all(promiseArray);
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
  const token = await getAuthToken();

  const newBlog = {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post(BLOGS_ENDPOINT)
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get(BLOGS_ENDPOINT);

  const contents = response.body.map((b) => b.title);

  expect(response.body).toHaveLength(initialBlogs.length + 1);
  expect(contents).toContainEqual("Canonical string reduction");
});

test("blog without title is not added", async () => {
  const token = await getAuthToken();

  const newBlog = {
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  };

  await api
    .post(BLOGS_ENDPOINT)
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400);

  const response = await api.get(BLOGS_ENDPOINT);
  expect(response.body).toHaveLength(initialBlogs.length);
});

test("blogs have a unique identifier called id", async () => {
  const response = await api.get(BLOGS_ENDPOINT);
  const blogs = response.body;
  expect(blogs).toBeDefined();

  blogs.forEach((blog) => {
    expect(blog.id).toBeDefined();
  });
});

test("Given missing likes property then set default value to 0", async () => {
  const token = await getAuthToken();

  const blogWithNoLikesProperty = {
    title: "Title",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
  };

  const response = await api
    .post(BLOGS_ENDPOINT)
    .set("Authorization", `Bearer ${token}`)
    .send(blogWithNoLikesProperty);
  expect(response.body.likes).toBe(0);
});

test("Given missing title or url properties then return 400", async () => {
  const token = await getAuthToken();

  const blogWithNoUrlProperty = {
    title: "Title",
    author: "Edsger W. Dijkstra",
  };
  await api
    .post(BLOGS_ENDPOINT)
    .set("Authorization", `Bearer ${token}`)
    .send(blogWithNoUrlProperty)
    .expect(400);
});

describe("Deletion of a blog post", () => {
  test("Success with 204 status code when valid id", async () => {
    const token = await getAuthToken();

    const result = await api.get(BLOGS_ENDPOINT).expect(200);

    const blogToDelete = result.body[0];
    await api
      .delete(`${BLOGS_ENDPOINT}/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  test("After deletion, blogs length should decrement by 1", async () => {
    const token = await getAuthToken();

    const result = await api.get(BLOGS_ENDPOINT);

    const blogToDelete = result.body[0];
    const initialLength = result.body.length;

    await api
      .delete(`${BLOGS_ENDPOINT}/${blogToDelete.id}`)
      .set("Authorization", `Bearer ${token}`);

    const response = await api.get(BLOGS_ENDPOINT);

    expect(response.body).toHaveLength(initialLength - 1);
  });
});

describe("Update of a blog post", () => {
  test("Blog update successful", async () => {
    const token = await getAuthToken();
    
    const result = await api.
    get(BLOGS_ENDPOINT)
    .expect(200);

    const blogs = result.body
    const blogToUpdate = blogs[0];
    
    const newLikes = blogToUpdate.likes + 100
    const updatedBlog = {
      ...blogToUpdate,
      user:blogToUpdate.user.id,
      likes: newLikes,
    };

    const response = await api
      .put(`${BLOGS_ENDPOINT}/${blogToUpdate.id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({likes:newLikes})
      .expect(200);
    expect(response.body).toEqual(updatedBlog);
  });
});

describe("Add a blog fails", () =>{
  test("when a token is not provided", async()=>{
    const newBlog = {
      author: "Edsger W. Dijkstra",
      url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
      likes: 12,
    };
  
    await api
      .post(BLOGS_ENDPOINT)
      .send(newBlog)
      .expect(401);
  
    const response = await api.get(BLOGS_ENDPOINT);
    expect(response.body).toHaveLength(initialBlogs.length);
  })
})

const getAuthToken = async () => {
  const result = await api
    .post(AUTH_ENDPOINT)
    .send({ username, password: SECRET })
  return result.body["token"];
};

afterAll(async () => {
  await mongoose.connection.close();
});
