import express from "express";
import { create } from "../controllers/auth.controller";
import { errorWrap } from "../utils/error.utils";

const router = express.Router();

router.post("/register", errorWrap(create, "Could not create user"));

export default router;