import { sendResponse } from "../utils/response.utils";
import { Request, Response } from "express";
import mongoose, { ClientSession } from "mongoose";
import { RequestError } from "../utils/globalErrorHandler";
import { handleAssignRole, handleUserCreation, handleUserLogin } from "../services/user.services";

export const create = async (req: Request, res: Response) => {
    const session: ClientSession = req.session!;

    try {
        const { user } = req.body;
        const newUser = await handleUserCreation(user, session);
        return res.status(201).json({ user_id: newUser.id, email: newUser.email });
    } catch (error) {
        throw new RequestError(
            `${error}`,
            500
        );
    }
};

export const login = async (req: Request, res: Response) => {
    const session: ClientSession = req.session!;

    try {
        const { user } = req.body;
        const token = await handleUserLogin(user, session);
        return res.status(201).json({ JWT_token: token });

    } catch (error) {
        throw new RequestError(
            `${error}`,
            500
        );
    }
};

export const assignRole = async (req: Request, res: Response) => {
    const session: ClientSession = req.session!;

    try {
        const { user } = req.body;
        const updatedUser = await handleAssignRole(user, session);
        return res.status(201).json({ id: updatedUser.id, role: updatedUser.role });

    } catch (error) {
        throw new RequestError(
            `${error}`,
            500
        );
    }
};