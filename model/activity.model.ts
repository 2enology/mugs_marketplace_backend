import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the schema
interface IActivityDatas extends Document {
  imgUrl: string;
  tokenId: string;
  mintAddr: string;
  txType: number;
  solPrice: number;
  tokenPrice: number;
  seller: string;
  buyer: string;
}

// Create the schema
const activityDatasSchema: Schema = new Schema(
  {
    imgUrl: { type: String, required: true },
    tokenId: { type: String, required: true },
    mintAddr: { type: String, required: true },
    txType: { type: Number, required: true },
    solPrice: { type: Number, required: true },
    tokenPrice: { type: Number, required: true },
    seller: { type: String, required: true },
    buyer: { type: String, required: true },
  },
  { timestamps: true }
);

// Customize toJSON method
activityDatasSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Create and export the model
const ActivityDatas = mongoose.model<IActivityDatas>(
  "activitydatas",
  activityDatasSchema
);
export default ActivityDatas;
