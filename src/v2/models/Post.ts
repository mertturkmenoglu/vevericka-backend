import mongoose from 'mongoose';

export type PostDocument = mongoose.Document & {
  createdBy: string;
  content: string;
  comments: string[];
  hashtags: string[];
  mentions: string[];
  createdAt: Date;
  updatedAt: Date;
};

const postSchema = new mongoose.Schema<PostDocument>({
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true,
  },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  hashtags: {
    type: [String],
    default: [],
  },
  mentions: {
    type: [String],
    default: [],
  },
}, { timestamps: true });

export const Post = mongoose.model<PostDocument>('Post', postSchema);
