import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Services extends Document {
  id: string;
  companyId: string;
  name: string;
  description: string;
  picture?: string[];
  price: number;
  unit: string;
  approved: boolean;
  createdAt: Date;
  updateAt: Date;
}

const ServicesSchema = new Schema<Services>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    companyId: {
      type: String,
    },
    name: { type: String },
    description: { type: String },
    picture: [
      {
        type: String,
      },
    ],
    price: { type: Number },
    unit: { type: String },
    approved: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export const ServicesModel = model<Services>('Services', ServicesSchema);
