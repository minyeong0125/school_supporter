import mongoose, { Schema } from "mongoose";

const commentSchema = new Schema(
  {
    postId: { type: String, required: true }, // 어떤 게시글에 달린 댓글인지 연결
    comment: { type: String, required: true },
    authorId: { type: String }, // 로그인한 사용자 id
    displayName: { type: String }, // 익명표시용
  },
  { timestamps: true }
);

const Comment =
  mongoose.models.comment || mongoose.model("comment", commentSchema);
export default Comment;
