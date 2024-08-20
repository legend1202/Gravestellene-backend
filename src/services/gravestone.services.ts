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
import { GravestoneModel, Gravestone } from '../models/gravestone.model';
import { RequestError } from '../utils/globalErrorHandler';
import { isValidDate } from '../utils/validate.utils';
import { Gender } from '../utils/constants';
import moment from 'moment';
import { findOneGraveyard } from './graveyard.services';
import { GraveyardModel } from '../models/graveyard.model';

export const handleSeed = async (session?: ClientSession) => {

  let index = 0;
  try {
    const stream = fs.createReadStream('./person info1.csv')
      .pipe(iconv.decodeStream('ISO-8859-1')) // Replace with the correct encoding
      .pipe(iconv.encodeStream('utf8'))
      .pipe(parse({ relax_quotes: true }))
      .on('data', async (row) => {

        index++;
        const graveyardName = row[0]

        const existingGraveyard = await findOneGraveyard({
          name: graveyardName,
        });

        console.log('----' + index + '----', existingGraveyard)

        if (existingGraveyard) {

          const newGravestone = new GravestoneModel({
            graveyardId: existingGraveyard.id,
            churchNumber: row[1],
            field: row[2],
            row: row[3],
            place: row[4],
            name: row[5] + " " + row[6],
            firstName: row[5],
            lastName: row[6],
            birthday: row[7],
            deceasedDate: row[8],
            ageOnDeath: row[9],
            burriedWith: row[10],
            peaceTo: row[11],
            location: '',
            picture: '',
            content: '',
            newsLink: '',
            forecastLink: '',
            approved: true,
          });
          await newGravestone.save({ session });

          console.log('=======' + index + '========', existingGraveyard.id)
          console.log(row);
        }

        console.log('=======' + index + '========')
      })
      .on('end', () => {
        console.log(index + 'counts added');
      });
  } catch (error) {

  }




};

export const getGravestonesByAdvancedSearch = async (
  name: any,
  birthday: any,
  deceasedDate: any,
  graveSite: any,
  session?: ClientSession
) => {
  let filter = {};

  if (
    !name &&
    !birthday.start &&
    !birthday.end &&
    !deceasedDate.start &&
    !deceasedDate.end &&
    !graveSite
  )
    return [];


  if (name) {
    filter = { ...filter, name: new RegExp(name, 'i') };
  }

  if (graveSite) {
    filter = { ...filter, graveSite };
  }

  // filter = { ...filter, approved: true };
  filter = { ...filter };

  // let gravestones = await GravestoneModel.find(filter, { _id: 0, __v: 0 }).limit(10);
  let gravestones = await GravestoneModel.aggregate([{
    $match: {
      name: new RegExp(name, 'i'),
    },
  },
  {
    $lookup: {
      from: GraveyardModel.collection.name,
      localField: 'graveyardId',
      foreignField: 'id',
      as: 'graveyardDetails',
    },
  },]).limit(10)

  if (birthday.start || birthday.end) {
    gravestones = gravestones.filter((stone) => {
      const stoneBirthday = moment(stone.birthday);
      return (
        (!birthday.start ||
          moment(birthday.start).isSameOrBefore(stoneBirthday)) &&
        (!birthday.end || moment(birthday.end).isSameOrAfter(stoneBirthday))
      );
    });
  }

  if (deceasedDate.start || deceasedDate.end) {
    gravestones = gravestones.filter((stone) => {
      const stoneDeceasedDate = moment(stone.deceasedDate);
      return (
        (!deceasedDate.start ||
          moment(deceasedDate.start).isSameOrBefore(stoneDeceasedDate)) &&
        (!deceasedDate.end ||
          moment(deceasedDate.end).isSameOrAfter(stoneDeceasedDate))
      );
    });
  }
  return gravestones;
};

export const getGravestonesByGraveyardId = async (graveyardId: string) => {
  if (!graveyardId) throw new RequestError('Invalid fields. graveyardId', 400);

  const filter = { graveyardId };

  const gravestones = await GravestoneModel.find(filter, { _id: 0, __v: 0 });

  return gravestones;
};

export const getGravestoneById = async (gravestoneId: string) => {
  if (!gravestoneId)
    throw new RequestError('Invalid fields. gravestoneId', 400);

  const filter = { id: gravestoneId };

  const gravestones = await GravestoneModel.find(filter, { _id: 0, __v: 0 });

  return gravestones;
};

export const handleGravestoneCreation = async (
  gravestone: Partial<Gravestone> & Document,
  session?: ClientSession
): Promise<Gravestone> => {
  const {
    graveyardId,
    name,
    birthday,
    deceasedDate,
    buriedDate,
  } = gravestone;

  if (!graveyardId) throw new RequestError('Invalid fields. graveyardId', 400);
  if (!name) throw new RequestError('Invalid fields. name', 400);

  if (!isValidDate(birthday) || !birthday)
    throw new RequestError(
      'Invalid fields. birthday type should be DD/MM/YYYY',
      400
    );
  if (!isValidDate(deceasedDate) || !deceasedDate)
    throw new RequestError(
      'Invalid fields. deceasedDate type should be DD/MM/YYYY',
      400
    );
  if (!isValidDate(buriedDate) || !buriedDate)
    throw new RequestError(
      'Invalid fields. buriedDate type should be DD/MM/YYYY',
      400
    );

  const existingGravestone = await findOneGravestone({
    name,
    birthday,
    deceasedDate,
    buriedDate,
  });

  if (existingGravestone) {
    throw new RequestError('This gravestone exist', 400);
  }

  const newGravestone = await createNewGravestone(
    gravestone,
    session
  );

  return newGravestone;
};

export const setApprove = async (
  gravestone: Partial<Gravestone> & Document,
  session?: ClientSession
): Promise<Gravestone> => {
  const { id, approved } = gravestone;

  if (!id) throw new RequestError('User Id must not be empty', 400);

  const updatedGravestone = await findByIdAndUpdateGravestoneDocument(id, {
    approved,
  });

  if (updatedGravestone) {
    return updatedGravestone;
  } else {
    throw new RequestError(`There is not ${id} gravestone.`, 500);
  }
};

export const handleGravestoneUpdate = async (
  gravestone: Partial<Gravestone> & Document,
  session?: ClientSession
): Promise<Gravestone> => {
  const { id } = gravestone;

  if (!id) throw new RequestError('Invalid fields. gravestoneId', 400);
  if (!gravestone) throw new RequestError('Invalid fields. gravestone', 400);

  const updatedGraveyard = await findByIdAndUpdateGravestoneDocument(id, {
    ...gravestone,
  });

  if (updatedGraveyard) {
    return updatedGraveyard;
  } else {
    throw new RequestError(`${id} graveyard update failed`, 500);
  }
};

export const deleteDocument = async (
  gravestoneId: string,
  session?: ClientSession
): Promise<any> => {
  if (!gravestoneId)
    throw new RequestError('Gravestone Id must not be empty', 400);

  const existingGravestone = await findOneGravestone({
    id: gravestoneId,
  });

  if (existingGravestone) {
    try {
      const deletedGravestone = await deleteGravestone(gravestoneId);
      return deletedGravestone;
    } catch (e: any) {
      throw new RequestError(`${e.errmsg}`, 500);
    }
  } else {
    throw new RequestError(`There is no ${gravestoneId} graveyard.`, 500);
  }
};

export async function findOneGravestone(
  filter?: FilterQuery<Gravestone>,
  projection?: ProjectionType<Gravestone>,
  options?: QueryOptions<Gravestone>
): Promise<Gravestone | null> {
  return await GravestoneModel.findOne(filter, projection, options);
}

export const createNewGravestone = async (
  gravestone: Partial<Gravestone> & Document,
  session?: ClientSession
): Promise<Gravestone> => {
  const newGravestone = new GravestoneModel({
    ...gravestone,
    approved: false,
  });

  await newGravestone.save({ session });
  return newGravestone;
};

export const findByIdAndUpdateGravestoneDocument = async (
  id: string,
  update: UpdateQuery<Gravestone>,
  options?: QueryOptions<Gravestone>
) => {
  return await GravestoneModel.findOneAndUpdate({ id }, update, {
    ...options,
    returnDocument: 'after',
  });
};

export const deleteGravestone = async (
  gravestoneId: string,
  options?: QueryOptions<Gravestone>
) => {
  return await GravestoneModel.deleteOne({ id: gravestoneId });
};
