import mongoose from 'mongoose';

export type MessageDocument = mongoose.Document & {
  sender: string;
  content: string;
  chat: string;
  readBy: string[];
  createdAt: Date;
  updatedAt: Date;
};

const messageSchema = new mongoose.Schema<MessageDocument>({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
  },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

export const Message = mongoose.model<MessageDocument>('Message', messageSchema);
