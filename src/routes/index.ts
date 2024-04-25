import express from "express";

import gravestoneRoutes from "./gravestone.routes";
import { sendResponse } from "../utils/response.utils";

const router = express.Router();

router.get("/", (req, res) => sendResponse(res, 200, `API is running`));
router.use("/api/gravestone", gravestoneRoutes);

export default router;
