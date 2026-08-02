import { Router } from "express";
import { userModel } from "../models/user.model.js";
import { petModel } from "../models/pet.model.js";
import { generateMockUsers, generateMockPets } from "../mocks/mocking.js";

const router = Router();

router.get("/mockingpets", (req, res) => {
  const quantity = Number(req.query.quantity) || 100;
  const pets = generateMockPets(quantity);
  res.json({ status: "success", payload: pets });
});

router.get("/mockingusers", (req, res) => {
  const users = generateMockUsers(50);
  res.json({ status: "success", payload: users });
});

router.post("/generateData", async (req, res) => {
  const { users, pets } = req.body;

  const usersToInsert = Number(users) || 0;
  const petsToInsert = Number(pets) || 0;

  if (usersToInsert < 0 || petsToInsert < 0) {
    return res.status(400).json({
      status: "error",
      error: "Parameters 'users' and 'pets' must be non-negative numbers.",
    });
  }

  try {
    const mockUsers = generateMockUsers(usersToInsert);
    const mockPets = generateMockPets(petsToInsert);

    const insertedUsers = mockUsers.length
      ? await userModel.insertMany(mockUsers)
      : [];
    const insertedPets = mockPets.length
      ? await petModel.insertMany(mockPets)
      : [];

    res.status(201).json({
      status: "success",
      message: "Data generated and inserted successfully.",
      inserted: {
        users: insertedUsers.length,
        pets: insertedPets.length,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
