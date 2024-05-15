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

export const handleServicesCreation = async (
  services: Partial<Services> & Document,
  session?: ClientSession
): Promise<Services> => {
  const { graveyardIds, companyId, name, description, picture, price, unit } =
    services;

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
    graveyardIds,
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
  const { id, graveyardId } = services;

  if (!id) throw new RequestError('Services Id must not be empty', 400);
  if (!graveyardId)
    throw new RequestError('graveyard Id must not be empty', 400);

  const existingService = await findOneServices({ id });

  if (existingService) {
    const graveyardIds = {
      graveyardIds: add(existingService.graveyardIds, graveyardId),
    };
    const updatedServices = await findByIdAndUpdateServicesDocument(id, {
      ...graveyardIds,
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
  if (!graveyardId)
    throw new RequestError('graveyard Id must not be empty', 400);

  const existingService = await findOneServices({ id });

  if (existingService) {
    const graveyardIds = {
      graveyardIds: remove(existingService.graveyardIds, graveyardId),
    };
    const updatedServices = await findByIdAndUpdateServicesDocument(id, {
      ...graveyardIds,
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

//////////////////////////////////////

export const createNewServices = async (
  graveyardIds: string[] | undefined,
  companyId: string,
  name: string,
  description: string,
  picture: string[] | undefined,
  price: number,
  unit: string,
  session?: ClientSession
): Promise<Services> => {
  const newServices = new ServicesModel({
    graveyardIds,
    companyId,
    name,
    description,
    picture,
    price,
    unit,
  });

  await newServices.save({ session });
  return newServices;
};

export async function findOneServices(
  filter?: FilterQuery<Services>,
  projection?: ProjectionType<Services>,
  options?: QueryOptions<Services>
): Promise<Services | null> {
  return await ServicesModel.findOne(filter, projection, options);
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
