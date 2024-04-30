import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Gravestone extends Document {
  id: string;
  graveyardId: string;
  name: string;
  gender: 'MAN' | 'WOMEN';
  birthday: string;
  deceasedDate: string;
  buriedDate: string;
  quarter: string;
  graveSite: string;
  homeTown: string;
  graveSiteNumber: string;
  approved: boolean;
  createdAt: Date;
  updateAt: Date;
}

const GravestoneSchema = new Schema<Gravestone>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    graveyardId: {
      type: String,
    },
    name: { type: String },
    gender: { type: String },
    birthday: { type: String },
    deceasedDate: { type: String },
    buriedDate: { type: String },
    quarter: { type: String },
    graveSite: { type: String },
    homeTown: { type: String },
    graveSiteNumber: { type: String },
    approved: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export const GravestoneModel = model<Gravestone>(
  'Gravestone',
  GravestoneSchema
);
