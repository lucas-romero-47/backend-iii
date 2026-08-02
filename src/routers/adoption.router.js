import { Router } from "express";
import mongoose from "mongoose";
import { adoptionModel } from "../models/adoption.model.js";
import { userModel } from "../models/user.model.js";
import { petModel } from "../models/pet.model.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const adoptions = await adoptionModel
      .find()
      .populate("owner")
      .populate("pet");
    res.json({ status: "success", payload: adoptions });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.get("/:aid", async (req, res) => {
  try {
    const { aid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      return res.status(400).json({ status: "error", error: "Invalid adoption ID." });
    }

    const adoption = await adoptionModel
      .findById(aid)
      .populate("owner")
      .populate("pet");

    if (!adoption) {
      return res.status(404).json({ status: "error", error: "Adoption not found." });
    }

    res.json({ status: "success", payload: adoption });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.post("/:uid/:pid", async (req, res) => {
  try {
    const { uid, pid } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(uid) ||
      !mongoose.Types.ObjectId.isValid(pid)
    ) {
      return res
        .status(400)
        .json({ status: "error", error: "Invalid user or pet ID." });
    }

    const user = await userModel.findById(uid);
    if (!user) {
      return res.status(404).json({ status: "error", error: "User not found." });
    }

    const pet = await petModel.findById(pid);
    if (!pet) {
      return res.status(404).json({ status: "error", error: "Pet not found." });
    }

    if (pet.adopted) {
      return res
        .status(400)
        .json({ status: "error", error: "Pet is already adopted." });
    }

    pet.adopted = true;
    pet.owner = user._id;
    await pet.save();

    user.pets.push({ _id: pet._id });
    await user.save();

    const adoption = await adoptionModel.create({
      owner: user._id,
      pet: pet._id,
    });

    res.json({ status: "success", message: "Pet adopted successfully.", payload: adoption });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

router.delete("/:aid", async (req, res) => {
  try {
    const { aid } = req.params;

    if (!mongoose.Types.ObjectId.isValid(aid)) {
      return res.status(400).json({ status: "error", error: "Invalid adoption ID." });
    }

    const adoption = await adoptionModel.findById(aid);
    if (!adoption) {
      return res.status(404).json({ status: "error", error: "Adoption not found." });
    }

    await petModel.findByIdAndUpdate(adoption.pet, {
      adopted: false,
      owner: null,
    });

    await userModel.findByIdAndUpdate(adoption.owner, {
      $pull: { pets: { _id: adoption.pet } },
    });

    await adoptionModel.findByIdAndDelete(aid);

    res.json({ status: "success", message: "Adoption reverted successfully." });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
