import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import { handleGraveyardCreation } from '../services/graveyard.services';

export const create = async (req: Request, res: Response) => {
  const { Graveyard } = req.body;
  const session: ClientSession = req.session!;

  const newGraveyard = await handleGraveyardCreation(Graveyard, session);

  return sendResponse(res, 200, 'Created Graveyard', newGraveyard);
};
