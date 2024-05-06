import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import { DecodedToken } from '../types/req.type';
import {
  deleteDocument,
  handleServicesCreation,
  updateServices,
} from '../services/services.services';

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

export const update = async (req: Request, res: Response) => {
  const { services } = req.body;

  const updatedServices = await updateServices(services);

  return sendResponse(
    res,
    200,
    'Services Updated Successfully',
    updatedServices
  );
};

export const deleteServices = async (req: Request, res: Response) => {
  const { serviceId } = req.body;

  const deletedServices = await deleteDocument(serviceId);

  return sendResponse(
    res,
    200,
    'Services Deleted Successfully',
    deletedServices
  );
};
