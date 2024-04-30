import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { Graveyard, GraveyardModel } from '../models/graveyard.model';
import { RequestError } from '../utils/globalErrorHandler';

export const handleGraveyardCreation = async (
  Graveyard: Partial<Graveyard> & Document,
  session?: ClientSession
): Promise<Graveyard> => {
  const {
    fellesraadId,
    name,
    location,
    picture,
    content,
    newsLink,
    forecastLink,
  } = Graveyard;

  if (!fellesraadId)
    throw new RequestError('Invalid fields. fellesraadId', 400);
  if (!name) throw new RequestError('Invalid fields. name', 400);
  if (!location) throw new RequestError('Invalid fields. location', 400);

  const existingGraveyard = await findOneGraveyard({
    fellesraadId,
    name,
    location,
  });

  if (existingGraveyard) {
    throw new RequestError('This Graveyard exist', 400);
  }

  const newGraveyard = await createNewGraveyard(
    fellesraadId,
    name,
    location,
    picture,
    content,
    newsLink,
    forecastLink,
    session
  );

  return newGraveyard;
};

export async function findOneGraveyard(
  filter?: FilterQuery<Graveyard>,
  projection?: ProjectionType<Graveyard>,
  options?: QueryOptions<Graveyard>
): Promise<Graveyard | null> {
  return await GraveyardModel.findOne(filter, projection, options);
}

export const createNewGraveyard = async (
  fellesraadId: string,
  name: string,
  location: string,
  picture: string[] | undefined,
  content: string | undefined,
  newsLink: string | undefined,
  forecastLink: string | undefined,
  session?: ClientSession
): Promise<Graveyard> => {
  const newGraveyard = new GraveyardModel({
    fellesraadId,
    name,
    location,
    picture: picture || '',
    content: content || '',
    newsLink: newsLink || '',
    forecastLink: forecastLink || '',
    approved: false,
  });

  await newGraveyard.save({ session });
  return newGraveyard;
};

export const setApprove = async (
  graveyard: Partial<Graveyard> & Document,
  session?: ClientSession
): Promise<Graveyard> => {
  const { id, approved } = graveyard;

  if (!id) throw new RequestError('User Id must not be empty', 400);

  const updatedGraveyard = await findByIdAndUpdateGraveyardDocument(id, {
    approved,
  });

  if (updatedGraveyard) {
    return updatedGraveyard;
  } else {
    throw new RequestError(`There is not ${id} graveyard.`, 500);
  }
};

export const findByIdAndUpdateGraveyardDocument = async (
  id: string,
  update: UpdateQuery<Graveyard>,
  options?: QueryOptions<Graveyard>
) => {
  return await GraveyardModel.findOneAndUpdate({ id }, update, options);
};
