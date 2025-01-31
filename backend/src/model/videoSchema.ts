import mongoose, { Document, Model, Schema } from "mongoose";

export interface IVideo extends Document {
  title?: string;
  description?: string;
  key: string;
  path: string;
  uploadedBy: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  thumbnail?: string;
}

const videoSchema: Schema = new Schema(
  {
    title: { type: String, default: "default tilte", required: true },
    description: { type: String, default: "Default description" },
    key: { type: String, required: true },
    path: { type: String, required: true },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPrivate: { type: Boolean, default: false },
    thumbnail: { type: String, default: "https://i.pinimg.com/736x/27/13/9b/27139b573b1d9d5fe66e7e27e7127563.jpg" },
  },
  { timestamps: true }
);

const Video: Model<IVideo> = mongoose.model<IVideo>("Video", videoSchema);
export default Video;
