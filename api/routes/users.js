import express from "express";
import { getInfo, updateInfo } from "../controllers/user.js";

const router = express.Router();

router.get("/", getInfo);
router.put("/", updateInfo);

export default router;