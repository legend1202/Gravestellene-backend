import express from "express";
import authRoutes from "./auth.routes";
import gravestoneRoutes from "./gravestone.routes";
import { sendResponse } from "../utils/response.utils";

const router = express.Router();

router.get("/", (req, res) => sendResponse(res, 200, `API is running`));
router.use("/api/gravestone", gravestoneRoutes);
router.use("/api/auth", authRoutes);

export default router;
