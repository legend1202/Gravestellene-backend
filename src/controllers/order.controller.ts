import { Request, Response } from 'express';
import { ClientSession } from 'mongoose';
import { sendResponse } from '../utils/response.utils';
import { DecodedToken } from '../types/req.type';
import { getOrders, handleOrderCreation } from '../services/order.services';

export const create = async (
  req: Request & { userId?: DecodedToken['userId'] },
  res: Response
) => {
  const { order } = req.body;
  const userId = req.userId;
  const session: ClientSession = req.session!;

  const newOrder = await handleOrderCreation({ ...order, userId }, session);

  return sendResponse(res, 200, 'Created Order', newOrder);
};

export const get = async (req: Request, res: Response) => {
  const session: ClientSession = req.session!;

  const gravestones = await getOrders();

  return sendResponse(res, 200, 'Get Orders', gravestones);
};
