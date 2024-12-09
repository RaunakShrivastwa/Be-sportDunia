import express from "express";
import { handlePurchase } from "../controller/earningController.js";
import {varify} from '../controller/userController.js'
const router = express.Router();

router.post("/purchase",varify ,handlePurchase);

export default router;
