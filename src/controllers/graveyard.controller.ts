import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import {
  handleGraveyardCreation,
  handleGraveyardUpdate,
  setApprove,
  deleteDocument,
  getGraveyardsByToken,
} from '../services/graveyard.services';
import { DecodedToken } from '../types/req.type';

export const create = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { graveyard } = req.body;
  const session: ClientSession = req.session!;

  const newGraveyard = await handleGraveyardCreation(
    { ...graveyard, fellesraadId: req.userId },
    session
  );

  return sendResponse(res, 200, 'Created Graveyard', newGraveyard);
};

export const approve = async (req: Request, res: Response) => {
  const { graveyard } = req.body;

  const newGravestone = await setApprove(graveyard);

  return sendResponse(res, 200, 'Graveyard approved', newGravestone);
};

export const update = async (req: Request, res: Response) => {
  const { graveyard } = req.body;

  const newGravestone = await handleGraveyardUpdate(graveyard);

  return sendResponse(
    res,
    200,
    'Graveyard Updated Successfully',
    newGravestone
  );
};

export const deleteGraveyard = async (req: Request, res: Response) => {
  const { graveyardId } = req.body;

  const deletedGraveyard = await deleteDocument(graveyardId);

  return sendResponse(
    res,
    200,
    'Graveyard Deleted Successfully',
    deletedGraveyard
  );
};

export const getByToken = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const userId = req.userId;

  const graveyards = await getGraveyardsByToken(userId);

  return sendResponse(res, 200, 'Get Graveyards', graveyards);
};
