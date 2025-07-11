import { Schema, model } from 'mongoose';
import { IUser, Status, UserType } from './interfaces';
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');



const addressSchema = new mongoose.Schema({
  name: {type: String, require: true},
  street: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: {
    type: String,
    required: true,
    minlength: [10, 'Phone number must be at least 10 digits long'],
    maxlength: [15, 'Phone number cannot exceed 15 digits'],
    validate: {
      validator: function (v: string) {
        return /^\d+$/.test(v);
      },
      message: (props: any) => `${props?.value} is not a valid phone number! Phone number should contain only digits.`
    }
  }
});

// User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,

  },
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: true
  },
  password: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    enum: UserType,
    require: true,
    default: UserType.User
  },
 
  addresses: [{
    type: addressSchema,
    required: false
  }],


  status: { type: String, enum: Status, default: 'active' },
  version: { type: Number, default: 1 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true,
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Skip if password is not modified
  const saltRounds = +`${process.env.PASSWORD_SALT}`;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

userSchema.pre(['findOneAndUpdate', 'updateOne'], async function (next) {
  const update = this.getUpdate() as any;
  const password = update?.$set?.password;
  if (password) {
    const salt = await bcrypt.genSalt(+`${process.env.PASSWORD_SALT}`);
    const hashedPassword = await bcrypt.hash(password, salt);
    this.set({ password: hashedPassword });
  }
  this.set({ updatedAt: new Date() });
  next();
});

export default model<IUser>('User', userSchema);
