import mongoose from 'mongoose';

export type ExploreDocument = mongoose.Document & {
  tags: string[];
  post: string;
  createdAt: Date;
  updatedAt: Date;
};

const exploreSchema = new mongoose.Schema<ExploreDocument>(
  {
    tags: {
      type: [String],
      default: [],
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  },
  { timestamps: true },
);

export const Explore = mongoose.model<ExploreDocument>('Explore', exploreSchema);
