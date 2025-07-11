import mongoose, { ObjectId, Document } from "mongoose";


export interface IBasicFields extends Document {
  isActive: boolean;
  createdAt: Date;
  createdBy: ObjectId;
  updatedAt: Date;
  updatedBy: ObjectId,
  status: string,
  version: number
}

export interface BasicQueryFields {
  search?: string,
  page?: number,
  limit?: number,
  userType?: string,
  status?: string
}
// User interface
export interface IUser extends IBasicFields {
  email: string;
  firstName: string;
  lastName: string
  password: string;
  userType: UserType,
 
  addresses: {
    street: string,
    city: string,
    state: string,
    zipCode: string,
    country: string,
    phone: number
  }[]
}

export enum UserType {
  Admin = "admin",
  User = "user",
  Operator = "Operator"
}

// enums 
export enum Status {
  Active = 'active',
  InActive = 'inactive',
  Deleted = 'deleted'
}
