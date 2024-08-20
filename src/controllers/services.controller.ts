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
  serviceRequest,
  getAllRequests,
  getRequestsByGraveyardId,
  getRequestsByCompanyId,
  approveRequest,
} from '../services/services.services';
import { RequestError } from '../utils/globalErrorHandler';

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

export const getByCompanyId = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const userId = req.userId;
  if (!userId) {
    throw new RequestError('companyId is required', 400);
  }

  const session: ClientSession = req.session!;

  const servervices = await getServicesByComapnyId(userId);

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

export const sendServiceRequest = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { request } = req.body;
  const session: ClientSession = req.session!;

  const newRequest = await serviceRequest(
    { ...request, companyId: req.userId },
    session
  );

  return sendResponse(res, 200, 'Created Service Request', newRequest);
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

export const getRequests = async (req: Request, res: Response) => {
  const { graveyardId, companyId } = req.params;
  const services = await getAllRequests(graveyardId, companyId);

  return sendResponse(res, 200, 'Get Requests', services);
};

export const getRequestsByGrave = async (req: Request, res: Response) => {
  const { graveyardId } = req.params;
  const services = await getRequestsByGraveyardId(graveyardId);

  return sendResponse(res, 200, 'Get Requests', services);
};

export const getRequestsByCompany = async (req: Request & { userId?: DecodedToken['userId'] }, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    throw new RequestError('companyId is required', 400);
  }
  const services = await getRequestsByCompanyId(userId);

  return sendResponse(res, 200, 'Get Requests', services);
};

export const setApproveRequest = async (req: Request, res: Response) => {
  const { requestId } = req.body;
  const request = await approveRequest(requestId);

  return sendResponse(res, 200, 'Request Approved Successfully', request);
};
