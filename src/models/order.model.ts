import { Document, model, Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export interface Order extends Document {
  id: string;
  graveyardId: string;
  gravestoneId: string;
  userId: string;
  servicesList: [string];
  ssn: string;
  approved: Boolean;
  createdAt: Date;
  updateAt: Date;
}

const OrderSchema = new Schema<Order>(
  {
    id: {
      type: String,
      default: uuidv4,
      required: true,
      unique: true,
    },
    graveyardId: {
      type: String,
      ref: 'Graveyard',
    },
    gravestoneId: {
      type: String,
      ref: 'Gravestone',
    },
    userId: {
      type: String,
    },
    servicesList: [
      {
        type: String,
        ref: 'Services',
      },
    ],
    ssn: { type: String },
    approved: { type: Boolean },
  },
  {
    timestamps: true,
  }
);

OrderSchema.virtual('serviceObjects', {
  ref: 'Services',
  localField: 'servicesList',
  foreignField: 'id',
  justOne: false,
  options: { sort: { name: 1 }, limit: 100 },
});

export const OrderModel = model<Order>('Order', OrderSchema);
