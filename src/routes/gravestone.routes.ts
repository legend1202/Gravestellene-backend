import express from "express";
import { get } from "../controllers/gravestone.controller";
import { errorWrap } from "../utils/error.utils";

const router = express.Router();

router.get("/:userAuth0Id", errorWrap(get, "Could not get user"));

export default router;