import { sendResponse } from '../utils/response.utils';
import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { RequestError } from '../utils/globalErrorHandler';
import {
  handleAssignRole,
  handleGetUsers,
  handleUserCreation,
  handleUserLogin,
} from '../services/user.services';

export const create = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { user } = req.body;
    const newUser = await handleUserCreation(user, session);
    return sendResponse(res, 201, 'Created User Successfully', {
      user_id: newUser.id,
      email: newUser.email,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const login = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { user } = req.body;
    const { token, id, name, email, role, avatar } = await handleUserLogin(
      user,
      session
    );
    return sendResponse(res, 200, 'Login Successfully', {
      user: { id, name, email, avatar, role },
      JWT_token: token,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const getUsers = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const users = await handleGetUsers(session);
    return sendResponse(res, 200, 'Get Users', {
      users,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};

export const assignRole = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  try {
    const { user } = req.body;
    const updatedUser = await handleAssignRole(user, session);
    return sendResponse(res, 201, 'Role assigned', {
      id: updatedUser.id,
      role: updatedUser.role,
    });
  } catch (error) {
    throw new RequestError(`${error}`, 500);
  }
};
