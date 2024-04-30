import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface User extends Document {
  id: string;
  avatar?: string;
  name: string;
  nickName?: string;
  address: string;
  postcode: string;
  street: string;
  email: string;
  phone: string;
  website: string;
  birthday: string;
  password: string;
  role?: 'ADMIN' | 'FELLESRAAD' | 'COMPANY' | 'CLIENT';
  bio: string;
  createdAt: Date;
  updateAt: Date;
}

const UserSchema = new Schema<User>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    avatar: { type: String },
    name: { type: String },
    nickName: { type: String },
    address: { type: String },
    postcode: { type: String },
    street: { type: String },
    email: { type: String },
    phone: { type: String },
    website: { type: String },
    birthday: { type: String },
    password: { type: String, required: true },
    role: {
      type: String,
    },
    bio: { type: String },
  },
  {
    timestamps: true,
  }
);

export const UserModel = model<User>('User', UserSchema);
