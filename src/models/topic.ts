import mongoose, { Schema } from "mongoose";

const topicSchema = new Schema(
  {
    index: { type: Number, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    views: { type: Number, default: 0 },
    author: { type: String },
  },
  { timestamps: true }
);

const Topic = mongoose.models.writing || mongoose.model("writing", topicSchema);
export default Topic;
