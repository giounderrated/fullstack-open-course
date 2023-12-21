const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const helper = require("../utils/list_helper");

const bcrypt = require("bcrypt");
const User = require("../models/User.model");

const USERS_ENDPOINT = "/api/users/";

const SECRET = "sekret";
const ROUNDS = 10;

describe("when there is initially one user in db", () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash(SECRET, ROUNDS);
    const newUser = new User({
      name: "Dane",
      username: "danew",
      passwordHash,
    });
    await newUser.save();
  });

  test("users are returned as json", async () => {
    await api
      .get(USERS_ENDPOINT)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("a specific user is within the returned users", async () => {
    const usersAtStart = await helper.usersInDb();
    const user = usersAtStart[0];
    const usernames = usersAtStart.map((user) => user.username);
    expect(usernames).toContain(user.username);
  });

  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb();

    const name = "Andromeda";
    const username = "anD067";
    const password = await bcrypt.hash(SECRET, ROUNDS);

    const newUser = {
      name,
      username,
      password,
    };

    await api
      .post(USERS_ENDPOINT)
      .send(newUser)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test("creation fails with proper statuscode and message if username already taken", async () => {
    const name = "Dane";
    const username = "danew";
    const password = await bcrypt.hash(SECRET, ROUNDS);

    const newUser = {
      name,
      username,
      password,
    };

    const usersAtStart = await helper.usersInDb();

    const result = await api
      .post(USERS_ENDPOINT)
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/);

    const usersAtEnd = await helper.usersInDb();

    expect(result.body.error).toContain("expected `username` to be unique");
    expect(usersAtEnd).toEqual(usersAtStart);
    expect(usersAtEnd).toHaveLength(usersAtStart.length);
  });
});
