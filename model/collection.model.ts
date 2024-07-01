import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the schema
interface ICollectionData extends Document {
  imgUrl: string;
  collectionName: string;
  collectionAddr: string;
  twitterLink: string;
  discordLink: string;
  currentPrice: number;
  previousPrice: number;
  volume: number;
  change: number;
  sales: number;
  marketCap: number;
  totalVolume: number;
}

// Create the schema
const collectionDataSchema: Schema = new Schema(
  {
    imgUrl: { type: String, required: true },
    collectionName: { type: String, required: true },
    collectionAddr: { type: String, required: true },
    twitterLink: { type: String },
    discordLink: { type: String },
    currentPrice: { type: Number },
    previousPrice: { type: Number },
    volume: { type: Number },
    change: { type: Number },
    sales: { type: Number },
    marketCap: { type: Number },
    totalVolume: { type: Number },
  },
  { timestamps: true }
);

// Customize toJSON method
collectionDataSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Create and export the model
const CollectionData = mongoose.model<ICollectionData>(
  "collections",
  collectionDataSchema
);
export default CollectionData;
