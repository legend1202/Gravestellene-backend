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
  getGravestonesByGraveyardId,
  getGravestoneById,
  handleSeed
} from '../services/gravestone.services';
import { DecodedToken } from '../types/req.type';

export const seed = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {


  const newGraveyard = await handleSeed();

  return sendResponse(res, 200, 'Created Graveyard', newGraveyard);
};

export const get = async (req: Request, res: Response) => {
  const { name, birthday, deceasedDate, graveSite } = req.query;
  const session: ClientSession = req.session!;

  // if (!name) throw new RequestError('gravestoneName is required', 400);
  const gravestones = await getGravestonesByAdvancedSearch(
    name,
    birthday,
    deceasedDate,
    graveSite,
    session
  );

  return sendResponse(res, 200, 'Get Gravestones', gravestones);
};

export const getByGraveyardId = async (req: Request, res: Response) => {
  const { graveyardId } = req.params;

  const session: ClientSession = req.session!;

  // if (!name) throw new RequestError('gravestoneName is required', 400);

  const gravestones = await getGravestonesByGraveyardId(graveyardId);

  return sendResponse(res, 200, 'Get Gravestones', gravestones);
};

export const getById = async (req: Request, res: Response) => {
  const { gravestoneId } = req.params;

  const session: ClientSession = req.session!;

  const gravestone = await getGravestoneById(gravestoneId);

  return sendResponse(res, 200, 'Get Gravestone', gravestone);
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
