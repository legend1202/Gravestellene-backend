import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';
import { handleGraveyardCreation } from '../services/graveyard.services';

export const create = async (req: Request, res: Response) => {
  const { graveyard } = req.body;
  const session: ClientSession = req.session!;

  const newGraveyard = await handleGraveyardCreation(graveyard, session);

  return sendResponse(res, 200, 'Created Graveyard', newGraveyard);
};
