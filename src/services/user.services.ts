import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Document } from 'mongoose';
import { ClientSession, FilterQuery, ProjectionType, QueryOptions } from "mongoose";
import { RequestError, AuthenticationError } from "../utils/globalErrorHandler";
import { User, UserModel } from "../models/user.model";

export const handleUserCreation = async (user: Partial<User> & Document, session?: ClientSession): Promise<User> => {
    const { email, password } = user;

    if (!email) throw new RequestError("Invalid fields", 400);
    if (!password) throw new RequestError("Password must not be empty", 400);

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

export const handleUserLogin = async (user: Partial<User> & Document, session?: ClientSession): Promise<String> => {
    const { email, password } = user;

    if (!email) throw new RequestError("Invalid fields", 400);
    if (!password) throw new RequestError("Password must not be empty", 400);

    const existingUser = await findOneUser({ email });

    if (existingUser?.role && ["ADMIN", "FELLESRAAD", "COMPANY", "CLIENT"].includes(existingUser?.role)) {
        const passwordMatch = await bcrypt.compare(password, existingUser?.password);

        if (!passwordMatch) {
            throw new AuthenticationError(
                `Password didn't match.`,
               
            );

        } else {            
            const secretKey: string = process.env.JWT_SECRET_KEY || '';
            const token = jwt.sign({ userId: existingUser.id }, secretKey, {
                expiresIn: '1h',
            });
            return token
        }

    } else {
        throw new AuthenticationError(
            `You didn't approved by admin.`,
        );
    }

};

export async function findOneUser(
    filter?: FilterQuery<User>,
    projection?: ProjectionType<User>,
    options?: QueryOptions<User>
): Promise<User | null> {
    return await UserModel.findOne(filter, projection, options);
};


export const createNewUser = async (
    email: string,
    password: string,
    session?: ClientSession
): Promise<User> => {
    const newUser = new UserModel({
        email,
        password,
    });

    await newUser.save({ session });
    return newUser;
};
