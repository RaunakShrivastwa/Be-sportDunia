import express from "express";
import { registerUser,login,singleUser } from "../controller/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post('/login',login);
router.get('/single/user/:id',singleUser)

export default router;
