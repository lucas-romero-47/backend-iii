import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger.config.js";

import mocksRouter from "./routers/mocks.router.js";
import usersRouter from "./routers/users.router.js";
import petsRouter from "./routers/pets.router.js";
import adoptionRouter from "./routers/adoption.router.js";

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/mocks", mocksRouter);
app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionRouter);

const PORT = process.env.PORT || 8080;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/backend3";

if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(MONGO_URL)
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => {
      console.error("MongoDB connection error:", error.message);
      process.exit(1);
    });
}

export default app;
