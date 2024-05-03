import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import { DecodedToken } from '../types/req.type';
import { handleServicesCreation } from '../services/services.services';

export const create = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { services } = req.body;
  const session: ClientSession = req.session!;

  const newGraveyard = await handleServicesCreation(
    { ...services, companyId: req.userId },
    session
  );

  return sendResponse(res, 200, 'Created Services', newGraveyard);
};
