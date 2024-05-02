import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';
import {
  handleGraveyardCreation,
  handleGraveyardUpdate,
  setApprove,
} from '../services/graveyard.services';
import { DecodedToken } from '../types/req.type';

export const create = async (req: Request, res: Response) => {
  const { graveyard } = req.body;
  const session: ClientSession = req.session!;

  const newGraveyard = await handleGraveyardCreation(graveyard, session);

  return sendResponse(res, 200, 'Created Graveyard', newGraveyard);
};

export const approve = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { graveyard } = req.body;

  const userId = req.userId;

  const session: ClientSession = req.session!;

  const newGravestone = await setApprove(graveyard);

  return sendResponse(res, 200, 'Graveyard approved', newGravestone);
};

export const update = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { graveyard } = req.body;

  const userId = req.userId;

  const session: ClientSession = req.session!;

  const newGravestone = await handleGraveyardUpdate(graveyard);

  return sendResponse(
    res,
    200,
    'Graveyard Updated Successfully',
    newGravestone
  );
};
