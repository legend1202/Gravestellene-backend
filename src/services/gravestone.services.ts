import { ClientSession, FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { GravestoneModel } from "../models/gravestone.model";

export const getGravestonesByName = async (
    name: string,
    session?: ClientSession
) => {
    var regex = new RegExp("^" + name + "$", "i");
    const user = await GravestoneModel.findOne({ name: { $regex: regex } }, {}, { session: session });

    return user;
};