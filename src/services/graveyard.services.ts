import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import fs from 'fs';
import { parse, } from 'csv-parse';
import iconv from 'iconv-lite';
import { Graveyard, GraveyardModel } from '../models/graveyard.model';
import { RequestError } from '../utils/globalErrorHandler';
import { findOneUser } from './user.services';

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

export const handleSeed = async (session?: ClientSession) => {
  console.log('=====Start Seed Graveyard=====');
  let index = 0;

  const stream = fs.createReadStream('./graveyards.csv')
    .pipe(iconv.decodeStream('ISO-8859-1')) // Replace with the correct encoding
    .pipe(iconv.encodeStream('utf8'))
    .pipe(parse())
    .on('data', async (row) => {
      console.log(row);
      index++;
      const newGraveyard = new GraveyardModel({
        fellesraadId: 'a40945cd-d5c1-49bb-bf75-2e580f358b0b',
        name: row[0],
        location: '',
        picture: '',
        content: '',
        newsLink: '',
        forecastLink: '',
        approved: true,
      });
      await newGraveyard.save({ session });
    })
    .on('end', () => {
      console.log(index + 'counts added');
    });



};

export const handleGraveyardUpdate = async (
  graveyard: Partial<Graveyard> & Document,
  session?: ClientSession
): Promise<Graveyard> => {
  const { id } = graveyard;

  if (!id) throw new RequestError('Invalid fields. graveyardId', 400);
  if (!graveyard) throw new RequestError('Invalid fields. graveyard', 400);

  const updatedGraveyard = await findByIdAndUpdateGraveyardDocument(
    id,
    { ...graveyard },
    { returnNewDocument: true }
  );

  if (updatedGraveyard) {
    return updatedGraveyard;
  } else {
    throw new RequestError(`${id} graveyard update failed`, 500);
  }
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

  if (!id) throw new RequestError('Graveyard Id must not be empty', 400);

  const updatedGraveyard = await findByIdAndUpdateGraveyardDocument(id, {
    approved,
  });

  if (updatedGraveyard) {
    return updatedGraveyard;
  } else {
    throw new RequestError(`There is not ${id} graveyard.`, 500);
  }
};

export const deleteDocument = async (
  graveyardId: string,
  session?: ClientSession
): Promise<any> => {
  if (!graveyardId)
    throw new RequestError('Graveyard Id must not be empty', 400);

  const existingGraveyard = await findOneGraveyard({
    id: graveyardId,
  });

  if (existingGraveyard) {
    try {
      const deletedGraveyard = await deleteGraveyard(graveyardId);
      return deletedGraveyard;
    } catch (e: any) {
      throw new RequestError(`${e.errmsg}`, 500);
    }
  } else {
    throw new RequestError(`There is no ${graveyardId} graveyard.`, 500);
  }
};

export const getGraveyardsByToken = async (
  userId?: string,
  session?: ClientSession
): Promise<Graveyard[] | null> => {
  if (!userId) throw new RequestError('User Id must not be empty', 400);

  const existingUser = await findOneUser({
    id: userId,
  });

  if (existingUser) {
    const filter = { fellesraadId: existingUser.id };
    if (existingUser.role === 'ADMIN') {
      const filter = {};
      const graveyards = await findGraveyards(filter, { _id: 0, __v: 0 });
      return graveyards;
    } else if (existingUser.role === 'FELLESRAAD') {
      const filter = { fellesraadId: existingUser.id };
      const graveyards = await findGraveyards(filter, { _id: 0, __v: 0 });
      return graveyards;
    } else if (existingUser.role === 'COMPANY') {
      const filter = { approved: true };
      const graveyards = await findGraveyards(filter, { _id: 0, __v: 0 });
      return graveyards;
    } else {
      throw new RequestError(`You can't see graveyards`, 500);
    }
  } else {
    throw new RequestError(
      `Faild get graveyards created by ${userId} user`,
      500
    );
  }
};

export const getGraveyardById = async (
  id: string,
  session?: ClientSession
): Promise<Graveyard | null> => {

  const existingGraveyard = await findOneGraveyard({
    name: id,
  });

  if (!id) throw new RequestError('Graveyard Id must not be empty', 400);

  if (existingGraveyard) {
    return existingGraveyard;
  } else {
    throw new RequestError(`Can't find the graveyard`, 500);
  }
};

export const findByIdAndUpdateGraveyardDocument = async (
  id: string,
  update: UpdateQuery<Graveyard>,
  options?: QueryOptions<Graveyard>
) => {
  return await GraveyardModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};

export const deleteGraveyard = async (
  graveyardId: string,
  options?: QueryOptions<Graveyard>
) => {
  return await GraveyardModel.deleteOne({ id: graveyardId });
};

export async function findGraveyards(
  filter: FilterQuery<Graveyard>,
  projection?: ProjectionType<Graveyard>,
  options?: QueryOptions<Graveyard>
): Promise<Graveyard[] | null> {
  return await GraveyardModel.find(filter, projection, options);
}

export const getAllGraveyards = async (): Promise<Graveyard[] | null> => {
  try {
    const filter = { approved: true };
    const graveyards = await findGraveyards(filter, { _id: 0, __v: 0 });
    return graveyards;
  } catch (error) {
    throw new RequestError(`You can't see graveyards`, 500);
  }
};
