import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the schema
interface IListedNfts extends Document {
  tokenId: string;
  collectionAddr: string;
  imgUrl: string;
  mintAddr: string;
  seller: string;
  metaDataUrl: string;
  solPrice: number;
  tokenPrice: number;
}

// Create the schema
const listedNftsSchema: Schema = new Schema(
  {
    tokenId: { type: String, required: true },
    collectionAddr: { type: String, required: true },
    imgUrl: { type: String, required: true },
    mintAddr: { type: String, required: true },
    seller: { type: String, required: true },
    metaDataUrl: { type: String, required: true },
    solPrice: { type: Number, required: true },
    tokenPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

// Customize toJSON method
listedNftsSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Create and export the model
const ListedNfts = mongoose.model<IListedNfts>("listednfts", listedNftsSchema);
export default ListedNfts;
