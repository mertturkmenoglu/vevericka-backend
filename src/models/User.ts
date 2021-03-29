import mongoose from 'mongoose';
import validate from 'validator';
import * as argon2 from 'argon2';

type Language = {
  language: string;
  proficiency: string;
}

export type UserDocument = mongoose.Document & {
  username: string;
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  name: string;
  image: string;
  hobbies: string[];
  features: string[];
  bdate: Date;
  followers: string[];
  following: string[];
  location: {
    city: string;
    country: string;
  };
  job: string;
  school: string;
  website: string;
  twitter: string;
  bio: string;
  gender: string;
  languages: Language[];
  wishToSpeak: string[];
};

const userSchema = new mongoose.Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    maxLength: 32,
    unique: true,
    lowercase: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 255,
    unique: true,
    trim: true,
    validate: {
      validator: (v: string) => validate.isEmail(v),
      message: (props: any) => `${props.value} is not an email`,
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  passwordResetToken: {
    type: String,
    default: '',
  },
  passwordResetExpires: {
    type: Date,
    default: Date.now,
  },
  name: {
    type: String,
    required: true,
    maxLength: 255,
    trim: true,
  },
  image: {
    type: String,
    required: true,
    trim: true,
    default: 'profile.png',
    validate: {
      validator: (v: string) => validate.isURL(v),
      message: (props: any) => `${props.value} is not a URL`,
    },
  },
  hobbies: {
    type: [String],
    default: [],
  },
  features: {
    type: [String],
    default: [],
  },
  bdate: {
    type: Date,
    default: Date.now,
  },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  location: {
    city: {
      type: String,
      default: '',
      maxLength: 32,
      trim: true,
    },
    country: {
      type: String,
      default: '',
      trim: true,
      maxLength: 32,
    },
  },
  job: {
    type: String,
    default: '',
    trim: true,
    maxLength: 255,
  },
  school: {
    type: String,
    default: '',
    trim: true,
    maxLength: 255,
  },
  website: {
    type: String,
    default: '',
    trim: true,
    maxLength: 255,
  },
  twitter: {
    type: String,
    default: '',
    trim: true,
    maxLength: 32,
  },
  bio: {
    type: String,
    default: '',
    trim: true,
    maxLength: 255,
  },
  gender: {
    type: String,
    default: '',
    trim: true,
    maxLength: 32,
  },
  languages: [{
    language: {
      type: String,
      default: '',
      trim: true,
      maxLength: 32,
    },
    proficiency: {
      type: String,
      default: '',
      trim: true,
      maxLength: 32,
    },
  }],
  wishToSpeak: [{
    type: String,
    default: '',
    trim: true,
    maxLength: 32,
  }],
}, { timestamps: true });

userSchema.pre('save', function save(next) {
  const user = this as UserDocument;

  if (!user.isModified('password')) {
    return next();
  }

  return argon2.hash(user.password)
    .then((hashed) => {
      user.password = hashed;
      return next();
    })
    .catch((err) => {
      console.log(err);
    });
});

export const User = mongoose.model<UserDocument>('User', userSchema);
