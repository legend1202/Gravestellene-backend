import mongoose, { ClientSession } from 'mongoose';
import { Request, Response } from 'express';
import { sendResponse } from '../utils/response.utils';
import { RequestError } from '../utils/globalErrorHandler';
import {
  getGravestonesByAdvancedSearch,
  handleGravestoneCreation,
  handleGravestoneUpdate,
  deleteDocument,
  setApprove,
} from '../services/gravestone.services';
import { DecodedToken } from '../types/req.type';

export const get = async (req: Request, res: Response) => {
  const {
    name,
    birthday,
    deceasedDate,
    buriedDate,
    quarter,
    graveSite,
    graveSiteNumber,
  } = req.body;

  const session: ClientSession = req.session!;

  // if (!name) throw new RequestError('gravestoneName is required', 400);

  const gravestones = await getGravestonesByAdvancedSearch(
    name,
    birthday,
    deceasedDate,
    quarter,
    graveSite,
    graveSiteNumber,
    session
  );

  return sendResponse(res, 200, 'Get Gravestones', gravestones);
};

export const create = async (req: Request, res: Response) => {
  const { gravestone } = req.body;

  const session: ClientSession = req.session!;

  const newGravestone = await handleGravestoneCreation(gravestone);

  return sendResponse(res, 200, 'Created Gravestone', newGravestone);
};

export const approve = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { gravestone } = req.body;

  const userId = req.userId;

  const session: ClientSession = req.session!;

  const newGravestone = await setApprove(gravestone);

  return sendResponse(res, 200, 'Gravestone approved', newGravestone);
};

export const update = async (req: Request, res: Response) => {
  const { gravestone } = req.body;

  const newGravestone = await handleGravestoneUpdate(gravestone);

  return sendResponse(
    res,
    200,
    'Gravestone Updated Successfully',
    newGravestone
  );
};

export const deleteGravestone = async (req: Request, res: Response) => {
  const { gravestoneId } = req.body;

  const deletedGravestone = await deleteDocument(gravestoneId);

  return sendResponse(
    res,
    200,
    'Gravestone Deleted Successfully',
    deletedGravestone
  );
};
