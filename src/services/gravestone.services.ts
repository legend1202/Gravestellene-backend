import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
} from 'mongoose';
import { GravestoneModel, Gravestone } from '../models/gravestone.model';
import { RequestError } from '../utils/globalErrorHandler';
import { isValidDate } from '../utils/validate.utils';

export const getGravestonesByName = async (
  name: string,
  session?: ClientSession
) => {
  var regex = new RegExp('^' + name + '$', 'i');
  const user = await GravestoneModel.findOne(
    { name: { $regex: regex } },
    {},
    { session: session }
  );

  return user;
};

export const handleGravestoneCreation = async (
  gravestone: Partial<Gravestone> & Document,
  session?: ClientSession
): Promise<Gravestone> => {
  const {
    graveyardId,
    name,
    gender,
    birthday,
    deceasedDate,
    buriedDate,
    quarter,
    graveSite,
    homeTown,
    graveSiteNumber,
    approved,
  } = gravestone;

  if (!graveyardId) throw new RequestError('Invalid fields. graveyardId', 400);
  if (!name) throw new RequestError('Invalid fields. name', 400);
  if (!gender) throw new RequestError('Invalid fields. gender', 400);
  if (!isValidDate(birthday) || !birthday)
    throw new RequestError('Invalid fields. birthday type shouldbe', 400);
  if (!isValidDate(deceasedDate) || !deceasedDate)
    throw new RequestError('Invalid fields. deceasedDate', 400);
  if (!isValidDate(buriedDate) || !buriedDate)
    throw new RequestError('Invalid fields. buriedDate', 400);
  if (!quarter) throw new RequestError('Invalid fields. quarter', 400);
  if (!graveSite) throw new RequestError('Invalid fields. graveSite', 400);
  if (!homeTown) throw new RequestError('Invalid fields. homeTown', 400);
  if (!graveSiteNumber)
    throw new RequestError('Invalid fields. graveSiteNumber', 400);

  const existingGravestone = await findOneGravestone({
    name,
    gender,
    birthday,
    deceasedDate,
    buriedDate,
  });

  if (existingGravestone) {
    throw new RequestError('This gravestone exist', 400);
  }

  const newGravestone = await createNewGravestone(
    graveyardId,
    name,
    gender,
    birthday,
    deceasedDate,
    buriedDate,
    quarter,
    graveSite,
    homeTown,
    graveSiteNumber,
    session
  );

  return newGravestone;
};

export async function findOneGravestone(
  filter?: FilterQuery<Gravestone>,
  projection?: ProjectionType<Gravestone>,
  options?: QueryOptions<Gravestone>
): Promise<Gravestone | null> {
  return await GravestoneModel.findOne(filter, projection, options);
}

export const createNewGravestone = async (
  graveyardId: string,
  name: string,
  gender: string,
  birthday: string,
  deceasedDate: string,
  buriedDate: string,
  quarter: string,
  graveSite: string,
  homeTown: string,
  graveSiteNumber: string,
  session?: ClientSession
): Promise<Gravestone> => {
  const newGravestone = new GravestoneModel({
    graveyardId,
    name,
    gender,
    birthday,
    deceasedDate,
    buriedDate,
    quarter,
    graveSite,
    homeTown,
    graveSiteNumber,
    approved: false,
  });

  await newGravestone.save({ session });
  return newGravestone;
};
