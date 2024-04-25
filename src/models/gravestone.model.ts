import { Document, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Gravestone extends Document {
  id: string;
  fellesraadId: string;
  name: string;
  location: string;
  picture?: string;
  content?: string;
  newsLink?: string;
  forecastLink?: string;
  createdAt: Date;
  updateAt: Date;
}

const GravestoneSchema = new Schema<Gravestone>({
  id: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  fellesraadId: {
    type: String,
    default: uuidv4,
    required: true,
    unique: true,
  },
  name: { type: String, unique: true, sparse: true },
  location: { type: String, required: true, unique: true },
  picture: { type: String },
  content: { type: String },
  newsLink: { type: String },
  forecastLink: { type: String }
}, {
  timestamps: true,
});

export const GravestoneModel = model<Gravestone>("Gravestone", GravestoneSchema);