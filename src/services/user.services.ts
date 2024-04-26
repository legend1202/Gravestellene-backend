import bcrypt from 'bcrypt';
import { ClientSession, FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { RequestError } from "../utils/globalErrorHandler";
import { User, UserModel } from "../models/user.model";

export const handleUserCreation = async (user: any, session: ClientSession) => {
    const { email, password } = user;

    if (!email) throw new RequestError("Invalid fields", 400);

    const existingUser = await findOneUser({ email });

    if (existingUser) {
        throw new RequestError(
            `Can't register this user. this email used by someone.`,
            500
          );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createNewUser(email, hashedPassword, session);

    return newUser;
};

export async function findOneUser(
    filter?: FilterQuery<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
) {
    return await UserModel.findOne(filter, projection, options);
};

export const createNewUser = async (
    email: string,
    password: string,
    session?: ClientSession
) => {
    const newUser = new UserModel({
        email,
        password,
    });

    await newUser.save({ session });
    return newUser;
};