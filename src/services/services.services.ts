import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { Services, ServicesModel } from '../models/services.model';
import { RequestError } from '../utils/globalErrorHandler';
import { DecodedToken } from '../types/req.type';
import { add, remove } from '../utils/common';
import { Request, RequestModel } from '../models/request.model';
import { GraveyardModel } from '../models/graveyard.model';

export const handleServicesCreation = async (
  services: Partial<Services> & Document,
  session?: ClientSession
): Promise<Services> => {
  const { companyId, name, description, picture, price, unit } = services;

  if (!companyId) throw new RequestError('Invalid fields. companyId', 400);
  if (!name) throw new RequestError('Invalid fields. name', 400);
  if (!description) throw new RequestError('Invalid fields. description', 400);
  if (!price) throw new RequestError('Invalid fields. price', 400);
  if (!unit) throw new RequestError('Invalid fields. unit', 400);

  const existingServices = await findOneServices({
    companyId,
    name,
    description,
    price,
    unit,
  });

  if (existingServices) {
    throw new RequestError('This Services exist', 400);
  }

  const newServices = await createNewServices(
    companyId,
    name,
    description,
    picture,
    price,
    unit,
    session
  );

  return newServices;
};

export const updateServices = async (
  services: Partial<Services> & Document,
  session?: ClientSession
): Promise<Services> => {
  const { id, companyId } = services;

  if (!id) throw new RequestError('Services Id must not be empty', 400);
  if (!companyId) throw new RequestError('company Id must not be empty', 400);

  const existingService = await findOneServices({ id, companyId });

  if (existingService) {
    const updatedServices = await findByIdAndUpdateServicesDocument(id, {
      ...services,
    });

    if (updatedServices) {
      return updatedServices;
    } else {
      throw new RequestError(`There is not ${id} service.`, 500);
    }
  } else {
    throw new RequestError(`You can't update ${id} service.`, 500);
  }
};

export const addGraveyardId = async (
  services: Partial<Services> & Document & { graveyardId: string },
  session?: ClientSession
): Promise<Services> => {
  const { id } = services;

  if (!id) throw new RequestError('Services Id must not be empty', 400);

  const existingService = await findOneServices({ id });

  if (existingService) {
    const updatedServices = await findByIdAndUpdateServicesDocument(id, {
      approved: true,
    });

    if (updatedServices) {
      return updatedServices;
    } else {
      throw new RequestError(
        `Update Failed. There is not ${id} services.`,
        500
      );
    }
  } else {
    throw new RequestError(`There is not ${id} services.`, 500);
  }
};

export const removeGraveyardId = async (
  services: Partial<Services> & Document & { graveyardId: string },
  session?: ClientSession
): Promise<Services> => {
  const { id, graveyardId } = services;

  if (!id) throw new RequestError('Services Id must not be empty', 400);

  const existingService = await findOneServices({ id });

  if (existingService) {
    const updatedServices = await findByIdAndUpdateServicesDocument(id, {
      approved: false,
    });

    if (updatedServices) {
      return updatedServices;
    } else {
      throw new RequestError(
        `Update Failed. There is not ${id} services.`,
        500
      );
    }
  } else {
    throw new RequestError(`There is not ${id} services.`, 500);
  }
};

export const deleteDocument = async (
  serviceId: string,
  session?: ClientSession
): Promise<any> => {
  if (!serviceId) throw new RequestError('Services Id must not be empty', 400);

  const existingServices = await findOneServices({
    id: serviceId,
  });

  if (existingServices) {
    try {
      const deletedServices = await deleteServices(serviceId);
      return deletedServices;
    } catch (e: any) {
      throw new RequestError(`${e.errmsg}`, 500);
    }
  } else {
    throw new RequestError(`There is no ${serviceId} services.`, 500);
  }
};

export const getAllServices = async (
  session?: ClientSession
): Promise<Services[] | null> => {
  const services = await ServicesModel.find();

  if (services) {
    return services;
  } else {
    throw new RequestError(`Can't find the services`, 500);
  }
};

export const getServiceById = async (
  id: string,
  session?: ClientSession
): Promise<Services | null> => {
  const existingService = await findOneServices({
    id: id,
  });

  if (!id) throw new RequestError('Service Id must not be empty', 400);

  if (existingService) {
    return existingService;
  } else {
    throw new RequestError(`Can't find the service`, 500);
  }
};

export const getServicesByComapnyId = async (companyId: string) => {
  if (!companyId) throw new RequestError('Invalid fields. companyId', 400);

  const filter = { companyId };

  const services = await ServicesModel.find(filter, { _id: 0, __v: 0 });

  return services;
};

export const getServicesByGraveyardId = async (graveyardId: string) => {
  if (!graveyardId) throw new RequestError('Invalid fields. graveyardId', 400);

  const filter = { graveyardIds: { $in: graveyardId } };

  const services = await ServicesModel.find(filter, { _id: 0, __v: 0 });

  return services;
};

export const serviceRequest = async (
  request: Partial<Request>,
  session?: ClientSession
): Promise<any> => {
  const { fellesraadId, graveyardId, serviceId, companyId } = request;
  if (!fellesraadId)
    throw new RequestError('Fellesraad Id must not be empty', 400);
  if (!graveyardId)
    throw new RequestError('Graveyard Id must not be empty', 400);
  if (!serviceId) throw new RequestError('Service Id must not be empty', 400);
  if (!companyId) throw new RequestError('Company Id must not be empty', 400);

  const existingService = await findOneServices({ id: serviceId });
  if (existingService && existingService.approved) {
    const existingRequest = await findOneRequest({
      fellesraadId,
      graveyardId,
      serviceId,
      companyId,
    });

    if (existingRequest) {
      throw new RequestError(`This request is exist`, 500);
    } else {
      try {
        const newRequest = await createNewRequest(
          fellesraadId,
          graveyardId,
          serviceId,
          companyId,
          session
        );
        return newRequest;
      } catch (e: any) {
        throw new RequestError(`${e.errmsg}`, 500);
      }
    }
  } else {
    throw new RequestError(`This service didn't approved by Admin yet.`, 500);
  }
};

export const getAllRequests = async (
  graveyardId: string,
  companyId: string,
  session?: ClientSession
) => {
  try {
    const result = await RequestModel.aggregate([
      {
        $match: {
          graveyardId,
          companyId,
        },
      },
      {
        $lookup: {
          from: ServicesModel.collection.name,
          localField: 'serviceId',
          foreignField: 'id',
          as: 'serviceDetails',
        },
      },
      {
        $lookup: {
          from: GraveyardModel.collection.name,
          localField: 'graveyardId',
          foreignField: 'id',
          as: 'graveyardDetails',
        },
      },
      {
        $unwind: '$serviceDetails',
      },
      {
        $unwind: '$graveyardDetails',
      },
    ]);

    return result;
  } catch (error) {
    throw new RequestError(`Can't find the requests`, 500);
  }
};

export const getRequestsByGraveyardId = async (
  graveyardId: string,
  session?: ClientSession
) => {
  try {
    const result = await RequestModel.aggregate([
      {
        $match: {
          graveyardId,
        },
      },
      {
        $lookup: {
          from: ServicesModel.collection.name,
          localField: 'serviceId',
          foreignField: 'id',
          as: 'serviceDetails',
        },
      },
      {
        $lookup: {
          from: GraveyardModel.collection.name,
          localField: 'graveyardId',
          foreignField: 'id',
          as: 'graveyardDetails',
        },
      },
      {
        $unwind: '$serviceDetails',
      },
      {
        $unwind: '$graveyardDetails',
      },
    ]);

    return result;
  } catch (error) {
    throw new RequestError(`Can't find the requests`, 500);
  }
};

export const getRequestsByCompanyId = async (
  companyId: string,
  session?: ClientSession
) => {
  try {
    const result = await RequestModel.aggregate([
      {
        $match: {
          companyId,
        },
      },
      {
        $lookup: {
          from: ServicesModel.collection.name,
          localField: 'serviceId',
          foreignField: 'id',
          as: 'serviceDetails',
        },
      },
      {
        $lookup: {
          from: GraveyardModel.collection.name,
          localField: 'graveyardId',
          foreignField: 'id',
          as: 'graveyardDetails',
        },
      },
      {
        $unwind: '$serviceDetails',
      },
      {
        $unwind: '$graveyardDetails',
      },
    ]);

    return result;
  } catch (error) {
    throw new RequestError(`Can't find the requests`, 500);
  }
};

export const approveRequest = async (
  requestId: string,
  session?: ClientSession
): Promise<Request> => {
  if (!requestId) throw new RequestError('Request Id must not be empty', 400);

  const existingService = await findOneRequest({ requestId });

  if (existingService) {
    const updatedRequest = await RequestModel.findOneAndUpdate(
      { id: requestId },
      {
        approved: true,
      },
      { returnDocument: 'after' }
    );

    if (updatedRequest) {
      return updatedRequest;
    } else {
      throw new RequestError(
        `Update Failed. There is not ${requestId} request.`,
        500
      );
    }
  } else {
    throw new RequestError(`There is not ${requestId} request.`, 500);
  }
};

//////////////////////////////////////

export const createNewServices = async (
  companyId: string,
  name: string,
  description: string,
  picture: string[] | undefined,
  price: number,
  unit: string,
  session?: ClientSession
): Promise<Services> => {
  const newServices = new ServicesModel({
    companyId,
    name,
    description,
    picture,
    price,
    unit,
    approved: false,
  });

  await newServices.save({ session });
  return newServices;
};

export const createNewRequest = async (
  fellesraadId: string,
  graveyardId: string,
  serviceId: string,
  companyId: string,
  session?: ClientSession
): Promise<Request> => {
  const newRequest = new RequestModel({
    fellesraadId,
    graveyardId,
    serviceId,
    companyId,
    approved: false,
  });

  await newRequest.save({ session });
  return newRequest;
};

export async function findOneServices(
  filter?: FilterQuery<Services>,
  projection?: ProjectionType<Services>,
  options?: QueryOptions<Services>
): Promise<Services | null> {
  return await ServicesModel.findOne(filter, projection, options);
}

export async function findOneRequest(
  filter?: FilterQuery<Services>,
  projection?: ProjectionType<Services>,
  options?: QueryOptions<Services>
): Promise<Request | null> {
  return await RequestModel.findOne(filter, projection, options);
}

export const findByIdAndUpdateServicesDocument = async (
  id: string,
  update: UpdateQuery<Services>,
  options?: QueryOptions<Services>
) => {
  return await ServicesModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};

export const deleteServices = async (
  servicesId: string,
  options?: QueryOptions<Services>
) => {
  return await ServicesModel.deleteOne({ id: servicesId });
};

export async function findServices(
  filter: FilterQuery<Services>,
  projection?: ProjectionType<Services>,
  options?: QueryOptions<Services>
): Promise<Services[] | null> {
  return await ServicesModel.find(filter, projection, options);
}
