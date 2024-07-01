import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the schema
interface IUserProfileDatas extends Document {
  name: string;
  avatarImg: string;
  bannerImg: string;
  bio: string;
  walletAddr: string;
  telegram_id: string;
  email: string;
}

// Create the schema
const userProfileDatasSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    avatarImg: { type: String, required: true },
    bannerImg: { type: String, required: true },
    bio: { type: String, required: true },
    walletAddr: { type: String, required: true },
    telegram_id: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

// Customize toJSON method
userProfileDatasSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Create and export the model
const UserProfileDatas = mongoose.model<IUserProfileDatas>(
  "userprofiledata",
  userProfileDatasSchema
);
export default UserProfileDatas;
