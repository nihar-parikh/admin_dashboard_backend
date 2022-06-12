import express from "express";
import { body } from "express-validator"; //see docs.
import { auth, verifyAdmin } from "../middleware/auth.js";
import {
  deleteUser,
  getAllUsers,
  getAllUsersStats,
  getUser,
  loginUser,
  logout,
  signUpUser,
  updateUser,
} from "../controller/users.js";

const router = express.Router();

//signup
router.post(
  "/signup",
  [
    body("name").isLength({ min: 3 }),
    body("email", "enter valid email").isEmail(),
    body("password", "password must be atleast 5 characters").isLength({
      min: 5,
    }),
  ],
  signUpUser
);

//login
router.post("/login", loginUser);

//get user
router.get("/:id", auth, getUser);

//get all users
router.get("/", verifyAdmin, getAllUsers);

//get all users statistics
router.get("/stats", verifyAdmin, getAllUsersStats);

//update user
router.put("/:id", auth, updateUser);

//delete user
router.delete("/deleteuser/:id", auth, deleteUser);

//logout
router.post("/logout", auth, logout);

export default router;
