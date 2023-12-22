const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app")
const api = supertest(app)

const AUTH_LOGIN_ENDPOINT = "/api/auth/login"