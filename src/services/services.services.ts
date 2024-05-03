import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { Services, ServicesModel } from '../models/services.model';
import { RequestError } from '../utils/globalErrorHandler';

export const handleServicesCreation = async (
  services: Partial<Services> & Document,
  session?: ClientSession
): Promise<Services> => {
  const { graveyardId, companyId, name, description, picture, price } =
    services;

  if (!graveyardId) throw new RequestError('Invalid fields. graveyardId', 400);
  if (!companyId) throw new RequestError('Invalid fields. companyId', 400);
  if (!name) throw new RequestError('Invalid fields. name', 400);
  if (!description) throw new RequestError('Invalid fields. description', 400);
  if (!price) throw new RequestError('Invalid fields. price', 400);

  const existingServices = await findOneServices({
    graveyardId,
    companyId,
    name,
    description,
  });

  if (existingServices) {
    throw new RequestError('This Services exist', 400);
  }

  const newServices = await createNewServices(
    graveyardId,
    companyId,
    name,
    description,
    picture,
    price,
    session
  );

  return newServices;
};

export const createNewServices = async (
  graveyardId: string,
  companyId: string,
  name: string,
  description: string,
  picture: string[] | undefined,
  price: string,
  session?: ClientSession
): Promise<Services> => {
  const newServices = new ServicesModel({
    graveyardId,
    companyId,
    name,
    description,
    picture,
    price,
    approved: false,
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
