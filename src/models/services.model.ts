import { Document, model, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface Services extends Document {
    id: string;
    graveyardId: string;
    companyId: string;
    name: string;
    price: string;
    approved: boolean;
    createdAt: Date;
    updateAt: Date;
}

const ServicesSchema = new Schema<Services>({
    id: {
        type: String,
        default: uuidv4,
        required: true,
        unique: true,
    },
    graveyardId: {
        type: String,
        ref: "Graveyard",
        required: true,
        unique: true,
    },
    companyId: {
        type: String,
        ref: "User",
        required: true,
        unique: true,
    },
    name: { type: String },
    price: { type: String },
    approved: { type: Boolean },
}, {
    timestamps: true,
});

export const ServicesModel = model<Services>("Services", ServicesSchema);