import mongoose from "mongoose";
import { expect } from "chai";
import supertest from "supertest";
import app from "../src/app.js";
import { userModel } from "../src/models/user.model.js";
import { petModel } from "../src/models/pet.model.js";
import { adoptionModel } from "../src/models/adoption.model.js";

const request = supertest(app);

const MONGO_URL =
  process.env.MONGO_URL || "mongodb://localhost:27017/backend3_test";

describe("Adoption Router", function () {
  let testUser;
  let testPet;
  let testAdoption;

  before(async function () {
    await mongoose.connect(MONGO_URL);
  });

  after(async function () {
    await mongoose.connection.close();
  });

  beforeEach(async function () {
    await adoptionModel.deleteMany({});
    await userModel.deleteMany({});
    await petModel.deleteMany({});

    testUser = await userModel.create({
      first_name: "Test",
      last_name: "User",
      email: `test_${Date.now()}@example.com`,
      password: "hashedpassword123",
      role: "user",
      pets: [],
    });

    testPet = await petModel.create({
      name: "Buddy",
      specie: "dog",
      birthDate: new Date("2020-01-01"),
      adopted: false,
      owner: null,
      image: "https://example.com/buddy.jpg",
    });
  });

  describe("GET /api/adoptions", function () {
    it("should return an empty array when no adoptions exist", async function () {
      const res = await request.get("/api/adoptions");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").that.is.empty;
    });

    it("should return all adoptions", async function () {
      await adoptionModel.create({
        owner: testUser._id,
        pet: testPet._id,
      });

      const res = await request.get("/api/adoptions");

      expect(res.status).to.equal(200);
      expect(res.body.payload).to.have.lengthOf(1);
    });
  });

  describe("GET /api/adoptions/:aid", function () {
    it("should return an adoption by ID", async function () {
      const adoption = await adoptionModel.create({
        owner: testUser._id,
        pet: testPet._id,
      });

      const res = await request.get(`/api/adoptions/${adoption._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("owner");
      expect(res.body.payload).to.have.property("pet");
    });

    it("should return 404 for a non-existent adoption", async function () {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.get(`/api/adoptions/${fakeId}`);

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal("error");
    });

    it("should return 400 for an invalid ID", async function () {
      const res = await request.get("/api/adoptions/invalidid");

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal("error");
    });
  });

  describe("POST /api/adoptions/:uid/:pid", function () {
    it("should create an adoption successfully", async function () {
      const res = await request.post(
        `/api/adoptions/${testUser._id}/${testPet._id}`
      );

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.have.property("owner");
      expect(res.body.payload).to.have.property("pet");

      const updatedPet = await petModel.findById(testPet._id);
      expect(updatedPet.adopted).to.be.true;
      expect(updatedPet.owner.toString()).to.equal(testUser._id.toString());

      const updatedUser = await userModel.findById(testUser._id);
      const petIds = updatedUser.pets.map((p) => p._id.toString());
      expect(petIds).to.include(testPet._id.toString());
    });

    it("should return 400 when pet is already adopted", async function () {
      await request.post(`/api/adoptions/${testUser._id}/${testPet._id}`);

      const secondUser = await userModel.create({
        first_name: "Another",
        last_name: "User",
        email: `another_${Date.now()}@example.com`,
        password: "hashedpassword123",
        role: "user",
        pets: [],
      });

      const res = await request.post(
        `/api/adoptions/${secondUser._id}/${testPet._id}`
      );

      expect(res.status).to.equal(400);
      expect(res.body.error).to.include("already adopted");
    });

    it("should return 404 when user does not exist", async function () {
      const fakeUserId = new mongoose.Types.ObjectId();
      const res = await request.post(
        `/api/adoptions/${fakeUserId}/${testPet._id}`
      );

      expect(res.status).to.equal(404);
      expect(res.body.error).to.include("User not found");
    });

    it("should return 404 when pet does not exist", async function () {
      const fakePetId = new mongoose.Types.ObjectId();
      const res = await request.post(
        `/api/adoptions/${testUser._id}/${fakePetId}`
      );

      expect(res.status).to.equal(404);
      expect(res.body.error).to.include("Pet not found");
    });

    it("should return 400 for invalid IDs", async function () {
      const res = await request.post("/api/adoptions/baduid/badpid");

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal("error");
    });
  });

  describe("DELETE /api/adoptions/:aid", function () {
    it("should delete an adoption and revert pet/user state", async function () {
      const adoptRes = await request.post(
        `/api/adoptions/${testUser._id}/${testPet._id}`
      );
      const adoptionId = adoptRes.body.payload._id;

      const res = await request.delete(`/api/adoptions/${adoptionId}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");

      const updatedPet = await petModel.findById(testPet._id);
      expect(updatedPet.adopted).to.be.false;
      expect(updatedPet.owner).to.be.null;

      const updatedUser = await userModel.findById(testUser._id);
      const petIds = updatedUser.pets.map((p) => p._id.toString());
      expect(petIds).to.not.include(testPet._id.toString());
    });

    it("should return 404 for a non-existent adoption", async function () {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request.delete(`/api/adoptions/${fakeId}`);

      expect(res.status).to.equal(404);
      expect(res.body.status).to.equal("error");
    });

    it("should return 400 for an invalid ID", async function () {
      const res = await request.delete("/api/adoptions/invalidid");

      expect(res.status).to.equal(400);
      expect(res.body.status).to.equal("error");
    });
  });
});
