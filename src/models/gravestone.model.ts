import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Gravestone extends Document {
  id: string;
  graveyardId: string;
  name: string;
  firstName: string;
  lastName: string;
  churchNumber?: string;
  field?: string;
  row?: string;
  place?: string;
  birthday: string;
  deceasedDate: string;
  buriedDate: string;
  ageOnDeath?: string;
  burriedWith?: string;
  peaceTo?: string;
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
    firstName: { type: String },
    lastName: { type: String },
    churchNumber: { type: String },
    field: { type: String },
    row: { type: String },
    place: { type: String },
    birthday: { type: String },
    deceasedDate: { type: String },
    buriedDate: { type: String },
    burriedWith: { type: String },
    ageOnDeath: { type: String },
    peaceTo: { type: String },
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
