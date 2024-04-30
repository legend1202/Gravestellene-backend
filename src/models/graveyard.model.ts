import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Graveyard extends Document {
  id: string;
  fellesraadId: string;
  name: string;
  location: string;
  picture?: string[];
  content?: string;
  newsLink?: string;
  forecastLink?: string;
  approved: boolean;
  createdAt: Date;
  updateAt: Date;
}

const GraveyardSchema = new Schema<Graveyard>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    fellesraadId: {
      type: String,
    },
    name: { type: String },
    location: { type: String },
    picture: [
      {
        type: String,
      },
    ],
    content: { type: String },
    newsLink: { type: String },
    forecastLink: { type: String },
    approved: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export const GraveyardModel = model<Graveyard>('Graveyard', GraveyardSchema);
