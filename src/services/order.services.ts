import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';

import { RequestError } from '../utils/globalErrorHandler';
import { Order, OrderModel } from '../models/order.model';

export const handleOrderCreation = async (
  order: Partial<Order> & Document,
  session?: ClientSession
): Promise<Order> => {
  const { graveyardId, gravestoneId, userId, servicesList, ssn } = order;

  if (!graveyardId) throw new RequestError('Invalid fields. graveyardId', 400);
  if (!gravestoneId)
    throw new RequestError('Invalid fields. gravestoneId', 400);
  if (!userId) throw new RequestError('Invalid fields. userId', 400);
  if (!servicesList || servicesList.length < 1)
    throw new RequestError('Invalid fields. servicesList', 400);
  if (!ssn) throw new RequestError('Invalid fields. ssn', 400);

  const existingOrder = await findOneOrder({
    graveyardId,
    gravestoneId,
    userId,
    servicesList,
    ssn,
  });

  if (existingOrder) {
    throw new RequestError('This Graveyard exist', 400);
  }

  const newGraveyard = await createNewOrder(
    graveyardId,
    gravestoneId,
    userId,
    servicesList,
    ssn,
    session
  );

  return newGraveyard;
};

/////////////////////////////////////////////////////////

export async function findOneOrder(
  filter?: FilterQuery<Order>,
  projection?: ProjectionType<Order>,
  options?: QueryOptions<Order>
): Promise<Order | null> {
  return await OrderModel.findOne(filter, projection, options);
}

export const createNewOrder = async (
  graveyardId: string,
  gravestoneId: string,
  userId: string,
  servicesList: string[],
  ssn: string,
  session?: ClientSession
): Promise<Order> => {
  const newOrder = new OrderModel({
    graveyardId,
    gravestoneId,
    userId,
    servicesList,
    ssn,
  });

  await newOrder.save({ session });
  return newOrder;
};
