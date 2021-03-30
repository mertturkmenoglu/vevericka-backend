import mongoose from 'mongoose';

export type BookmarkDocument = mongoose.Document & {
  postId: string;
  belongsTo: string;
  createdAt: Date;
  updatedAt: Date;
};

const bookmarkSchema = new mongoose.Schema<BookmarkDocument>({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  belongsTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export const Bookmark = mongoose.model<BookmarkDocument>('Bookmark', bookmarkSchema);
