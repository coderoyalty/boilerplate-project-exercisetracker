const server = require("../index");
const chai = require("chai");
const chaiHttp = require("chai-http");
const UserModel = require("../models/user");

chai.use(chaiHttp);

const names = [
  "John",
  "Alice",
  "Michael",
  "Emma",
  "William",
  "Olivia",
  "Smith",
  "Johnson",
  "Brown",
  "Davis",
  "Wilson",
  "Lee",
];

function chooseNameRandomly() {
  const name = names[Math.floor(Math.random() * names.length)];

  return name;
}

const noUsers = 3;

describe("test user", () => {
  let newUser = null;
  beforeEach(() => {
    return new Promise(async (resolve) => {
      await UserModel.deleteMany({});
      // create users
      for (let i = 0; i < noUsers; i++) {
        const name = chooseNameRandomly();
        await UserModel.create({ username: name });
      }
      resolve();
    });
  });

  afterEach(() => {
    return new Promise(async (resolve) => {
      await UserModel.deleteMany({});
      resolve();
    });
  });

  it("GET /api/stats", (done) => {
    chai
      .request(server)
      .get("/api/stats")
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        const bodyJson = res.body;
        chai.expect(bodyJson.users).to.equal(noUsers);
        done();
      });
  });

  it("GET /api/users", (done) => {
    chai
      .request(server)
      .get("/api/users")
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(200);
        const bodyJson = res.body;
        chai.expect(Array.isArray(bodyJson)).to.be.true;
        const users = Array.from(bodyJson);
        for (let user of users) {
          chai.expect(user).property("username");
          chai.expect(user).property("_id");
        }
        done();
      });
  });

  it("POST /api/users", (done) => {
    const data = {
      username: "Royalty",
    };
    chai
      .request(server)
      .post("/api/users")
      .send(data)
      .end((err, res) => {
        chai.expect(err).to.be.null;
        chai.expect(res).to.have.status(201);
        const body = res.body;
        chai.expect(res.body).to.have.property("username", body.username);
        chai.expect(res.body).to.have.property("_id", body._id);
        newUser = body;
        done();
      });
  });

  after((done) => {
    const exitCode = 0;
    process.exit(exitCode);
  });
});
