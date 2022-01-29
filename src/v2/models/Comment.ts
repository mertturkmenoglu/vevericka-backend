import mongoose from 'mongoose';

export type CommentDocument = mongoose.Document & {
  postId: string;
  createdBy: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

const commentSchema = new mongoose.Schema<CommentDocument>({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true,
  },
}, { timestamps: true });

export const Comment = mongoose.model<CommentDocument>('Comment', commentSchema);
