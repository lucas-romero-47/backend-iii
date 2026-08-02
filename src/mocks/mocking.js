import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const generateMockUser = () => ({
  _id: new mongoose.Types.ObjectId(),
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  password: createHash("coder123"),
  role: faker.helpers.arrayElement(["user", "admin"]),
  pets: [],
});

export const generateMockUsers = (quantity) =>
  Array.from({ length: quantity }, generateMockUser);

export const generateMockPet = () => ({
  _id: new mongoose.Types.ObjectId(),
  name: faker.person.firstName(),
  specie: faker.animal.type(),
  birthDate: faker.date.birthdate({ min: 0, max: 15, mode: "age" }),
  adopted: false,
  owner: null,
  image: faker.image.urlLoremFlickr({ category: "animals" }),
});

export const generateMockPets = (quantity) =>
  Array.from({ length: quantity }, generateMockPet);
