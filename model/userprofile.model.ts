import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the schema
interface IUserProfileData extends Document {
  name: string;
  avatarImg: string;
  bannerImg: string;
  bio: string;
  walletAddr: string;
  telegram_id: string;
  email: string;
}

// Create the schema
const userProfileDataSchema: Schema = new Schema(
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
userProfileDataSchema.method("toJSON", function () {
  const { __v, _id, ...object } = this.toObject();
  object.id = _id;
  return object;
});

// Create and export the model
const UserProfileData = mongoose.model<IUserProfileData>(
  "users",
  userProfileDataSchema
);
export default UserProfileData;
