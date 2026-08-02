import { Router } from "express";
import { userModel } from "../models/user.model.js";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated MongoDB ObjectId
 *           example: "507f1f77bcf86cd799439011"
 *         first_name:
 *           type: string
 *           description: User's first name
 *           example: "John"
 *         last_name:
 *           type: string
 *           description: User's last name
 *           example: "Doe"
 *         email:
 *           type: string
 *           description: User's email address
 *           example: "john.doe@example.com"
 *         password:
 *           type: string
 *           description: Hashed password
 *           example: "$2b$10$..."
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User role
 *           example: "user"
 *         pets:
 *           type: array
 *           description: Array of adopted pet references
 *           items:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: Pet ObjectId
 *                 example: "507f1f77bcf86cd799439012"
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Retrieves a list of all registered users from the database.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully retrieved users list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 payload:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
router.get("/", async (req, res) => {
  try {
    const users = await userModel.find();
    res.json({ status: "success", payload: users });
  } catch (error) {
    res.status(500).json({ status: "error", error: error.message });
  }
});

export default router;
