import crypto from 'crypto';
import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';
import {
  getGravestonesByName,
  handleGravestoneCreation,
} from '../services/gravestone.services';

export const get = async (req: Request, res: Response) => {
  const { gravestoneName } = req.params;
  const session: ClientSession = req.session!;

  if (!gravestoneName)
    throw new RequestError('gravestoneName is required', 400);

  const gravestones = await getGravestonesByName(gravestoneName, session);
  if (!gravestones) throw new RequestError('Gravestone does not exist', 404);
  return sendResponse(res, 200, 'Get Gravestones', gravestones);
};

export const create = async (req: Request, res: Response) => {
  const { gravestone } = req.body;
  const session: ClientSession = req.session!;

  const newGravestone = await handleGravestoneCreation(gravestone, session);

  return sendResponse(res, 200, 'Created Gravestone', newGravestone);
};
