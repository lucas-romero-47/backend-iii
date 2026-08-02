import mongoose from "mongoose";

const collection = "adoptions";

const adoptionSchema = new mongoose.Schema({
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  pet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "pets",
    required: true,
  },
});

export const adoptionModel = mongoose.model(collection, adoptionSchema);
