import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the schema
interface IOfferDatas extends Document {
  imgUrl: string;
  tokenId: string;
  listedNftId: string;
  offerPrice: number;
  collectionAddr: string;
  byToken: boolean;
  royalty: number;
  expiresAt: number;
  mintAddr: string;
  active: number;
  seller: string;
  buyer: string;
}

// Create the schema
const offerDatasSchema: Schema = new Schema(
  {
    imgUrl: { type: String, required: true },
    tokenId: { type: String, required: true },
    listedNftId: { type: String, required: true },
    offerPrice: { type: Number, required: true },
    collectionAddr: { type: String, required: true },
    byToken: { type: Boolean, required: true },
    royalty: { type: Number, required: true },
    expiresAt: { type: Number, required: true },
    mintAddr: { type: String, required: true },
    active: { type: Number, required: true },
    seller: { type: String, required: true },
    buyer: { type: String, required: true },
  },
  { timestamps: true }
);

// Customize toJSON method
offerDatasSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Create and export the model
const OfferDatas = mongoose.model<IOfferDatas>("offerdatas", offerDatasSchema);
export default OfferDatas;
