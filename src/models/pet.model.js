import mongoose from "mongoose";

const collection = "pets";

const petSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specie: { type: String, required: true },
  birthDate: { type: Date },
  adopted: { type: Boolean, default: false },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "users", default: null },
  image: { type: String },
});

export const petModel = mongoose.model(collection, petSchema);
