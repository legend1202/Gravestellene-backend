import {
  ClientSession,
  FilterQuery,
  ProjectionType,
  QueryOptions,
  UpdateQuery,
} from 'mongoose';
import { GravestoneModel, Gravestone } from '../models/gravestone.model';
import { RequestError } from '../utils/globalErrorHandler';
import { isValidDate } from '../utils/validate.utils';
import { Gender } from '../utils/constants';
import { DateRange } from '../types/req.type';
import moment from 'moment';

export const getGravestonesByAdvancedSearch = async (
  name: string,
  birthday: DateRange,
  deceasedDate: DateRange,
  quarter: string,
  graveSite: string,
  graveSiteNumber: string,
  session?: ClientSession
) => {
  let filter = {};

  if (
    !name &&
    !birthday.start &&
    !birthday.end &&
    !deceasedDate.start &&
    !deceasedDate.end &&
    !quarter &&
    !graveSite &&
    !graveSiteNumber
  )
    return [];

  if (name) {
    filter = { ...filter, name: new RegExp(name, 'i') };
  }

  if (quarter) {
    filter = { ...filter, quarter };
  }

  if (graveSite) {
    filter = { ...filter, graveSite };
  }

  if (graveSiteNumber) {
    filter = { ...filter, graveSiteNumber };
  }

  filter = { ...filter, approved: true };

  let gravestones = await GravestoneModel.find(filter, { _id: 0, __v: 0 });

  if (birthday.start || birthday.end) {
    gravestones = gravestones.filter((stone) => {
      const stoneBirthday = moment(stone.birthday, 'DD/MM/YYYY');
      return (
        (!birthday.start ||
          moment(birthday.start, 'DD/MM/YYYY').isSameOrBefore(stoneBirthday)) &&
        (!birthday.end ||
          moment(birthday.end, 'DD/MM/YYYY').isSameOrAfter(stoneBirthday))
      );
    });
  }

  if (deceasedDate.start || deceasedDate.end) {
    gravestones = gravestones.filter((stone) => {
      const stoneDeceasedDate = moment(stone.deceasedDate, 'DD/MM/YYYY');
      return (
        (!deceasedDate.start ||
          moment(deceasedDate.start, 'DD/MM/YYYY').isSameOrBefore(
            stoneDeceasedDate
          )) &&
        (!deceasedDate.end ||
          moment(deceasedDate.end, 'DD/MM/YYYY').isSameOrAfter(
            stoneDeceasedDate
          ))
      );
    });
  }

  return gravestones;
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
  } = gravestone;

  if (!graveyardId) throw new RequestError('Invalid fields. graveyardId', 400);
  if (!name) throw new RequestError('Invalid fields. name', 400);
  if (!gender) throw new RequestError('Invalid fields. gender', 400);
  if (!Gender.includes(gender)) {
    throw new RequestError(
      `Gender must be include one of "MAN", "WOMEN".`,
      400
    );
  }
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
