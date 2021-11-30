import mongoose from 'mongoose';

export type ChatDocument = mongoose.Document & {
  users: string[];
  chatName: string;
  lastMessage: string | null;
  chatImage: string;
  isGroupChat: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const chatSchema = new mongoose.Schema<ChatDocument>({
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  chatName: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true,

  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null,
  },
  chatImage: {
    type: String,
    required: true,
    trim: true,
    default: 'chat.png',
  },
  isGroupChat: {
    type: Boolean,
    required: true,
    default: false,
  },
}, { timestamps: true });

export const Chat = mongoose.model<ChatDocument>('Chat', chatSchema);
