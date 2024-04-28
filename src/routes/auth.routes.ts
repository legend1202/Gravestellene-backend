import express from "express";
import verifyToken from "../middleware/auth.middleware";
import { create, login } from "../controllers/auth.controller";
import { errorWrap } from "../utils/error.utils";
import { withTransaction } from "../utils/transactionHelper";

const router = express.Router();

router.post("/register", errorWrap(create, "Could not create user"));
router.post(
    "/login",
    // errorWrap(verifyToken, "Could not verify JWT token"),
    withTransaction(
        errorWrap(login, "Could not login user")
    )
);

export default router;