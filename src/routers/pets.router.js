import { Router } from "express";
import { petModel } from "../models/pet.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const pets = await petModel.find();
    res.json({ status: "success", payload: pets });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
