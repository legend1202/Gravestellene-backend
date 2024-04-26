import { sendResponse } from "../utils/response.utils";
import { Request, Response } from "express";
import mongoose, { ClientSession } from "mongoose";
import { RequestError } from "../utils/globalErrorHandler";
import { handleUserCreation } from "../services/user.services";

export const create = async (req: Request, res: Response) => {
    const session: ClientSession = req.session!;

    try {
        const { user } = req.body;
        const newUser = await handleUserCreation(user, session);
        return res.status(201).json({ user_id: newUser.id, email: newUser.email });

    } catch (error) {
        throw new RequestError(
            `Something went wrong with creating: ${error}`,
            500
        );
    }
};