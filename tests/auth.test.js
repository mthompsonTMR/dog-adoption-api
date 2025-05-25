const request = require("supertest");
const http = require("http");
const mongoose = require("mongoose");
const app = require("../app");
const chai = require("chai/chai.js");
const expect = chai.expect;

let server;

before((done) => {
  server = http.createServer(app);
  server.listen(() => {
    console.log(" Test server started");
    done();
  });
});

after(async () => {
  console.log(" Cleaning up test environment...");

  // Gracefully stop the server
  await new Promise((resolve) => server.close(resolve));
  console.log(" Server closed");

  // Forcefully disconnect Mongoose
  await mongoose.disconnect();
  console.log(" Mongoose disconnected");
});


describe("Auth Routes", () => {
  it("should register a new user", async () => {
    const res = await request(server)
      .post("/api/auth/register")
      .send({
        name: "Test User",
        email: `testuser+${Date.now()}@example.com`,
        password: "test123"
      });

    expect(res.status).to.equal(201);
    expect(res.body).to.have.property("token");
    expect(res.body.user).to.have.property("email");
  });
});
