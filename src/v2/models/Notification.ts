import mongoose from 'mongoose';

export enum NotificationType {
  ON_USER_FOLLOW = 'ON_USER_FOLLOW',
  ON_MENTION = 'ON_MENTION',
  ON_COMMENT = 'ON_COMMENT',
}

export type NotificationDocument = mongoose.Document & {
  origin: string;
  target: string;
  type: NotificationType;
  delivered: boolean;
  metadata: string;
  createdAt: Date;
  updatedAt: Date;
  deliveredAt: Date;
};

const notificationSchema = new mongoose.Schema<NotificationDocument>(
  {
    origin: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    target: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['ON_USER_FOLLOW', 'ON_MENTION', 'ON_COMMENT'],
      required: true,
    },
    delivered: {
      type: Boolean,
      default: false,
    },
    metadata: {
      type: String,
    },
    deliveredAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export const Notification = mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema,
);
