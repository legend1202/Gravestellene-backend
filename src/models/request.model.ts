import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Request extends Document {
  id: string;
  fellesraadId: string;
  graveyardId: string;
  serviceId: string;
  companyId: string;
  approved: boolean;
  createdAt: Date;
  updateAt: Date;
}

const RequestSchema = new Schema<Request>(
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
    graveyardId: { type: String },
    serviceId: { type: String, ref: 'Service' },
    companyId: { type: String },
    approved: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

export const RequestModel = model<Request>('Request', RequestSchema);
