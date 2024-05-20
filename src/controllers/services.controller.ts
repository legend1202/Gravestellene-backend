import { Request, Response } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import { DecodedToken } from '../types/req.type';
import {
  deleteDocument,
  handleServicesCreation,
  updateServices,
  addGraveyardId,
  removeGraveyardId,
  getServicesByGraveyardId,
  getServiceById,
  getServicesByComapnyId,
  getAllServices,
} from '../services/services.services';

export const get = async (req: Request, res: Response) => {
  const services = await getAllServices();

  return sendResponse(res, 200, 'Get All Services', services);
};

export const getById = async (req: Request, res: Response) => {
  const { serviceId } = req.params;

  const session: ClientSession = req.session!;

  const service = await getServiceById(serviceId);

  return sendResponse(res, 200, 'Get Service', service);
};

export const getByGraveyardId = async (req: Request, res: Response) => {
  const { graveyardId } = req.params;

  const session: ClientSession = req.session!;

  const servervices = await getServicesByGraveyardId(graveyardId);

  return sendResponse(res, 200, 'Get Services', servervices);
};

export const getByCompanyId = async (req: Request, res: Response) => {
  const { companyId } = req.params;

  const session: ClientSession = req.session!;

  const servervices = await getServicesByComapnyId(companyId);

  return sendResponse(res, 200, 'Get Services', servervices);
};

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

export const setApprove = async (req: Request, res: Response) => {
  const { services } = req.body;

  const updatedServices = await addGraveyardId(services);

  return sendResponse(
    res,
    200,
    'Service Approved Successfully',
    updatedServices
  );
};

export const removeApprove = async (req: Request, res: Response) => {
  const { services } = req.body;

  const updatedServices = await removeGraveyardId(services);

  return sendResponse(
    res,
    200,
    'Service Deactivated Successfully',
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
